/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  category?: 'products' | 'faq';
}

// Dedicated local n8n AI Agent webhook endpoint
const CHAT_URL = 'http://localhost:5678/webhook/df5c2165-72f4-47a0-b074-12f0a4a96a19/chat';

/**
 * Generates or retrieves the persistent Session ID.
 * Stored in localStorage so page reloads or route changes do not wipe out
 * the backend n8n AI agent's chat memory.
 */
function getOrCreateSessionId(): string {
  try {
    const stored = localStorage.getItem('novi_ai_session_id');
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }
    const fresh =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('novi_ai_session_id', fresh);
    return fresh;
  } catch {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Deep recursive extractor for any n8n workflow output structure.
 * Unwraps arrays, nested objects, LangChain/OpenAI outputs, and plain strings.
 */
function extractAnswerFromPayload(data: any, depth = 0): string {
  if (data === null || data === undefined || depth > 8) return '';

  // 1. Array: traverse elements
  if (Array.isArray(data)) {
    for (const item of data) {
      const res = extractAnswerFromPayload(item, depth + 1);
      if (res) return res;
    }
    return '';
  }

  // 2. String
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (!trimmed) return '';

    // Discard any HTML, CSS, error page, or warmup markup
    if (
      trimmed.startsWith('<!DOCTYPE') ||
      trimmed.startsWith('<html') ||
      trimmed.startsWith('<head') ||
      trimmed.startsWith('<body') ||
      trimmed.startsWith('<div') ||
      trimmed.startsWith(':root') ||
      trimmed.includes('AI Studio Logo') ||
      trimmed.includes('warmup_start_time') ||
      trimmed.includes('Your application failed to start') ||
      trimmed.includes('Please wait while your application starts')
    ) {
      return '';
    }

    // Try parsing as JSON in case n8n serialized an object/array into text
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed !== null && (typeof parsed === 'object' || Array.isArray(parsed))) {
        const nested = extractAnswerFromPayload(parsed, depth + 1);
        if (nested) return nested;
      }
    } catch {
      // Plain text message from n8n AI agent
      return trimmed;
    }

    return trimmed;
  }

  // 3. Object
  if (typeof data === 'object') {
    if (data.json) {
      const res = extractAnswerFromPayload(data.json, depth + 1);
      if (res) return res;
    }
    if (data.data) {
      const res = extractAnswerFromPayload(data.data, depth + 1);
      if (res) return res;
    }

    const priorityKeys = [
      'output',
      'text',
      'answer',
      'response',
      'message',
      'reply',
      'content',
      'result',
      'msg',
      'body',
    ];

    for (const key of priorityKeys) {
      if (data[key] !== undefined && data[key] !== null) {
        const res = extractAnswerFromPayload(data[key], depth + 1);
        if (res) return res;
      }
    }

    if (Array.isArray(data.choices) && data.choices.length > 0) {
      const res = extractAnswerFromPayload(data.choices[0], depth + 1);
      if (res) return res;
    }

    for (const [k, v] of Object.entries(data)) {
      if (k === 'action' || k === 'sessionId' || k === 'file_category') continue;
      const res = extractAnswerFromPayload(v, depth + 1);
      if (res) return res;
    }
  }

  return '';
}

export const NoviChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<'products' | 'faq' | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Persistent Session ID (managed exclusively in background)
  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am **Novi AI**, powered by **Khizar Tech Store**.\n\nPlease select an inquiry category below to begin:',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // When a category is chosen, unlock input and show a clean user confirmation
  const selectCategory = (selected: 'products' | 'faq') => {
    setCategory(selected);
    const categoryName = selected === 'products' ? 'Products & Sales' : 'FAQ & Policies';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        sender: 'bot',
        text: `Category selected: **${categoryName}**. How can I help you today?`,
        time: timestamp,
        category: selected,
      },
    ]);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
  };

  /**
   * Generates a brand new Session ID when the user clicks the refresh/reset button.
   */
  const handleResetSession = () => {
    const fresh =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      localStorage.setItem('novi_ai_session_id', fresh);
    } catch {
      // ignore
    }

    setSessionId(fresh);
    setCategory(null);
    setInputVal('');
    setIsTyping(false);

    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        text: '🔄 **Conversation reset.** Please select a category below to start fresh:',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  /**
   * Dispatches the query directly to the n8n webhook backend.
   * Strictly dispatches:
   * - action: "sendMessage"
   * - chatInput: user message query
   * - sessionId: persistent session ID
   * - file_category: "products" or "faq" (strictly lowercase)
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputVal.trim();

    // STRICT GUARD: User cannot send any query until a category is chosen
    if (!category || !query || isTyping) {
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time,
      category,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const payload = {
      action: 'sendMessage',
      chatInput: query,
      sessionId: sessionId,
      file_category: category === 'products' ? 'products' : 'faq',
    };

    let liveAnswer: string | null = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      try {
        console.log('[Novi AI] Sending to webhook:', CHAT_URL, payload);
        const res = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const rawText = await res.text();
        console.log('[Novi AI] Webhook response:', res.status, rawText);

        let parsed: any;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          parsed = rawText;
        }

        const extracted = extractAnswerFromPayload(parsed);
        if (extracted && extracted.trim()) {
          liveAnswer = extracted.trim();
        } else if (rawText && rawText.trim() && !rawText.includes('<html') && !rawText.includes(':root')) {
          liveAnswer = rawText.trim();
        }
      } catch (primaryErr: any) {
        clearTimeout(timeoutId);
        console.warn('[Novi AI] Primary application/json dispatch note:', primaryErr);

        if (primaryErr?.name !== 'AbortError') {
          try {
            const fallbackRes = await fetch(CHAT_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain',
              },
              body: JSON.stringify(payload),
            });
            const fallbackText = await fallbackRes.text();
            console.log('[Novi AI] Fallback text/plain response:', fallbackRes.status, fallbackText);
            const extracted = extractAnswerFromPayload(fallbackText);
            if (extracted && extracted.trim()) {
              liveAnswer = extracted.trim();
            }
          } catch (textErr) {
            console.warn('[Novi AI] Fallback dispatch note:', textErr);
          }
        }
      }
    } catch (err) {
      console.warn('[Novi AI] Webhook execution note:', err);
    }

    if (liveAnswer) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: liveAnswer!,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'I apologize, but I could not receive a response from the server. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category,
        },
      ]);
    }

    setIsTyping(false);
  };

  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      if (line === '---') {
        return <hr key={idx} className="my-2 border-slate-200" />;
      }
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/~~(.*?)~~/g, '<del class="text-slate-400">$1</del>')
        .replace(/\*(.*?)\*/g, '<em class="text-slate-600">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-blue-700">$1</code>');

      return (
        <p
          key={idx}
          className={`${line.trim() === '' ? 'h-2' : 'my-1'} text-sm leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 group border border-white/20"
          aria-label="Open Novi AI Chat"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-semibold uppercase tracking-wider text-blue-100">AI Assistant</span>
            <span className="block text-sm font-bold text-white leading-tight">Chat with Novi</span>
          </div>
        </button>
      )}

      {/* Main Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-48px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base tracking-tight text-white">Novi AI</h3>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">Powered by Khizar Tech Store</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5">
              {/* Reset Session Button */}
              <button
                type="button"
                onClick={handleResetSession}
                title="Start a new conversation"
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 text-xs"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline text-[11px] font-medium text-slate-300">New Chat</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category Selector Bar */}
          <div className="bg-slate-50 px-3 py-2.5 border-b border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Inquiry Category {!category && <span className="text-rose-500 font-bold">*Required</span>}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectCategory('products')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                  category === 'products'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                <span>🛍️</span>
                <span>Products and Sales</span>
              </button>

              <button
                type="button"
                onClick={() => selectCategory('faq')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                  category === 'faq'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                }`}
              >
                <span>📋</span>
                <span>FAQ and Policies</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {isUser ? <p className="leading-relaxed">{msg.text}</p> : renderFormattedText(msg.text)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Novi AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area (Strictly Locked until Category is Selected) */}
          <div className="p-3 bg-white border-t border-slate-200">
            {!category && (
              <div className="mb-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Please select an inquiry category above to start chatting.</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={!category || isTyping}
                  placeholder={
                    !category
                      ? 'Select a category first...'
                      : category === 'products'
                      ? 'Type your message...'
                      : 'Type your message...'
                  }
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-150 focus:outline-none ${
                    !category
                      ? 'bg-slate-100/80 border-slate-200 text-slate-400 placeholder-slate-400/40 cursor-not-allowed placeholder:opacity-45'
                      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={!category || !inputVal.trim() || isTyping}
                className={`p-2.5 rounded-xl font-medium transition-all duration-150 flex items-center justify-center shrink-0 ${
                  !category || !inputVal.trim() || isTyping
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-blue-500/30 hover:scale-105 active:scale-95'
                }`}
                aria-label="Send message"
              >
                <svg className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
