/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/products';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isFallback?: boolean;
}

// User-specified dedicated n8n chat webhook endpoint
const CHAT_URL = 'http://localhost:5678/webhook/3c17df4f-05ed-4a80-b85d-f3991a46ca47/chat';

/**
 * Intelligent local assistant fallback for Khizar Tech Store
 * Generates accurate answers from the official product catalog and store policies
 * if the local n8n server is offline or unreachable.
 */
function generateLocalStoreResponse(query: string, category: 'products' | 'faq'): string {
  const q = query.toLowerCase().trim();

  // 1. FAQ / Policy Questions
  if (
    category === 'faq' ||
    q.includes('cod') ||
    q.includes('cash on delivery') ||
    q.includes('payment') ||
    q.includes('shipping') ||
    q.includes('delivery') ||
    q.includes('warranty') ||
    q.includes('return') ||
    q.includes('refund') ||
    q.includes('contact') ||
    q.includes('track')
  ) {
    if (q.includes('cod') || q.includes('cash on delivery') || q.includes('payment') || q.includes('pay')) {
      return `💵 **Payment Policy: Cash on Delivery (COD) Only**\n\n• **Zero Prepayment Required**: No credit or debit cards needed online.\n• **Doorstep Inspection**: When our air courier arrives, inspect your tamper-evident parcel before paying in cash.\n• **Official Receipt**: You receive an authentic printed Khizar Tech receipt from the delivery agent upon handover.`;
    }
    if (q.includes('shipping') || q.includes('delivery') || q.includes('track') || q.includes('how long')) {
      return `✈️ **Shipping & Dispatch Information**\n\n• **Express Air Delivery**: Delivered in **3 to 4 business days** via air express courier.\n• **Shipping Rates**: **FREE air delivery** on orders over $50 (standard fee is $15 for orders below $50).\n• **Courier Tracking**: Dispatch and courier phone details are sent via SMS and Email after ordering.`;
    }
    if (q.includes('warranty') || q.includes('guarantee')) {
      return `🛡️ **Khizar Tech 2-Year Full Hardware Warranty**\n\n• All 31 genuine devices and accessories sold on Khizar Tech include an official **2-year hardware replacement warranty**.\n• Rapid zero-hassle swap covering acoustic driver failure, GaN chipset degradation, battery defects, and hardware faults.`;
    }
    if (q.includes('return') || q.includes('refund')) {
      return `📦 **30-Day Unboxing & Inspection Guarantee**\n\n• If a product arrives with any manufacturing defect, notify us within 30 days for an immediate exchange.\n• Our courier coordinates doorstep pickup with zero return shipping fee.`;
    }
    return `📋 **Khizar Tech Store FAQ Highlights**\n\n• **Payment**: 100% Cash on Delivery (COD) at your doorstep.\n• **Shipping**: Express Air Delivery within 3–4 business days (Free over $50).\n• **Warranty**: 2-Year Comprehensive Hardware Warranty on all 31 products.\n• **Inspection**: Open and inspect parcel before handing cash to the courier.`;
  }

  // 2. Product Search & Details
  // Check if query mentions a product code like "01", "1", "#01", "product 1", "code 2"
  const codeMatch = q.match(/(?:code|product|item|#)\s*([0-9]{1,2})/i) || q.match(/\b([0-9]{1,2})\b/);
  if (codeMatch) {
    const rawNum = parseInt(codeMatch[1], 10);
    const paddedCode = rawNum < 10 ? `0${rawNum}` : `${rawNum}`;
    const matchedProduct = PRODUCTS.find((p) => p.code === paddedCode);
    if (matchedProduct) {
      const editions = matchedProduct.options?.find((o) => o.name === 'Edition')?.values || [];
      const editionsStr = editions.length > 0 ? editions.join(', ') : 'Standard';
      return `✨ **[#${matchedProduct.code}] ${matchedProduct.name}**\n\n• **Price**: $${matchedProduct.price}${matchedProduct.originalPrice ? ` ~~(Was $${matchedProduct.originalPrice})~~` : ''}\n• **Category**: ${matchedProduct.category.toUpperCase()} (${matchedProduct.subcategory})\n• **Available Editions**: ${editionsStr}\n• **Rating**: ⭐ ${matchedProduct.rating} / 5 (${matchedProduct.reviewCount} verified reviews)\n• **Key Features**:\n${matchedProduct.keyFeatures.slice(0, 3).map((f) => `  - ${f}`).join('\n')}\n\n*Would you like to explore other editions or add this to your bag?*`;
    }
  }

  // Keyword product matching
  const matchingProducts = PRODUCTS.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const tagMatch = p.tagline.toLowerCase().includes(q);
    const catMatch = p.category.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q);
    const descMatch = p.description.toLowerCase().includes(q);
    return nameMatch || tagMatch || catMatch || descMatch;
  });

  if (matchingProducts.length > 0) {
    if (matchingProducts.length === 1) {
      const p = matchingProducts[0];
      const editions = p.options?.find((o) => o.name === 'Edition')?.values || [];
      return `✨ **[#${p.code}] ${p.name}**\n\n• **Price**: $${p.price}\n• **Editions**: ${editions.join(', ') || 'Standard'}\n• **Overview**: ${p.tagline}\n• **Status**: ${p.inStock ? 'In Stock (Ready for Air Express Dispatch)' : 'Pre-order'}\n\n*Tip: All 31 products include Cash on Delivery and a 2-year warranty.*`;
    }

    const topItems = matchingProducts.slice(0, 4);
    const list = topItems
      .map((p) => {
        const editions = p.options?.find((o) => o.name === 'Edition')?.values || [];
        const editionPreview = editions.length > 0 ? ` (${editions.join(' / ')})` : '';
        return `• **[#${p.code}] ${p.name}** - **$${p.price}**${editionPreview}`;
      })
      .join('\n');

    return `🔍 Matching hardware items for **"${query}"**:\n\n${list}\n\nType the product code (e.g. **01**) or product name for full specifications and available editions.`;
  }

  // Default helpful response
  return `👋 I am **Novi**, your hardware advisor for Khizar Tech Store.\n\nI can help you explore our 31 precision hardware products, check pricing and available editions (like Ice Blue, Silver Titanium, and Onyx Black for AirPods [#01]), or explain our Cash on Delivery and Express Air Courier delivery.\n\n*Try asking: "Tell me about product 01", "What editions of AirPods are available?", or "How does Cash on Delivery work?"*`;
}

export const NoviChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<'products' | 'faq' | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hey there! 👋 Welcome to Khizar Tech Store. How can I assist you today? Please choose an inquiry topic below to get started.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getSessionId = (cat: 'products' | 'faq') => {
    const key = `novi_session_${cat}`;
    let id = localStorage.getItem(key);
    if (!id) {
      id = `novi_${cat}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(key, id);
    }
    return id;
  };

  const getAnswer = (data: any): string => {
    if (!data) return 'I received an empty response. Please verify the n8n webhook workflow.';
    if (Array.isArray(data)) {
      if (data.length === 0) return 'No response received from n8n.';
      data = data[0];
    }
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object' && parsed !== null) {
          data = parsed;
        } else {
          return data;
        }
      } catch {
        return data;
      }
    }
    if (typeof data === 'object' && data !== null) {
      if (typeof data.output === 'string') return data.output;
      if (typeof data.text === 'string') return data.text;
      if (typeof data.answer === 'string') return data.answer;
      if (typeof data.response === 'string') return data.response;
      if (typeof data.message === 'string') return data.message;
      if (typeof data.reply === 'string') return data.reply;
      if (data.data && typeof data.data.output === 'string') return data.data.output;
      if (data.data && typeof data.data.text === 'string') return data.data.text;
      if (data.data && typeof data.data.answer === 'string') return data.data.answer;
      if (data.json && typeof data.json.output === 'string') return data.json.output;
      if (data.json && typeof data.json.text === 'string') return data.json.text;

      const stringValues = Object.values(data).filter((v) => typeof v === 'string');
      if (stringValues.length > 0) return stringValues[0] as string;

      return JSON.stringify(data);
    }
    return String(data);
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const selectCategory = (cat: 'products' | 'faq') => {
    setCategory(cat);
    const catLabel = cat === 'products' ? '🛍️ Products & Sales' : '📋 FAQs & Policies';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        sender: 'bot',
        text: `You selected **${catLabel}**. What would you like to know?`,
        time: timestamp,
      },
    ]);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const handleClearChat = () => {
    if (category) {
      localStorage.removeItem(`novi_session_${category}`);
    }
    setCategory(null);
    setInputVal('');
    setIsTyping(false);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'Session reset. What can I help you with? Choose a category below to start fresh.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  /**
   * Dispatches message to n8n webhook with dual-payload injection
   * (both JSON body AND URL search params so n8n NEVER receives an empty JSON)
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query || !category || isTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const sessionId = getSessionId(category);

    // Construct comprehensive payload supporting all n8n node types
    const payload = {
      action: 'sendMessage',
      chatInput: query,
      message: query,
      query: query,
      text: query,
      input: query,
      sessionId,
      category,
      file_category: category,
      metadata: {
        file_category: category,
      },
    };

    // Attach parameters in query string as well so n8n's $json.query is always populated
    let requestUrl = CHAT_URL;
    try {
      const urlObj = new URL(CHAT_URL);
      urlObj.searchParams.set('chatInput', query);
      urlObj.searchParams.set('message', query);
      urlObj.searchParams.set('text', query);
      urlObj.searchParams.set('query', query);
      urlObj.searchParams.set('action', 'sendMessage');
      urlObj.searchParams.set('sessionId', sessionId);
      urlObj.searchParams.set('category', category);
      requestUrl = urlObj.toString();
    } catch {
      requestUrl = `${CHAT_URL}?chatInput=${encodeURIComponent(query)}&message=${encodeURIComponent(
        query
      )}&sessionId=${encodeURIComponent(sessionId)}&action=sendMessage&category=${encodeURIComponent(
        category
      )}`;
    }

    let liveAnswer: string | null = null;

    // Strategy 1: Standard direct JSON POST
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        let parsed: any;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = text;
        }
        liveAnswer = getAnswer(parsed);
      }
    } catch (directErr) {
      console.warn('Direct n8n webhook call note:', directErr);
    }

    // Strategy 2: If browser blocked direct JSON due to preflight, retry with text/plain simple POST
    if (!liveAnswer) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const resSimple = await fetch(requestUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (resSimple.ok) {
          const text = await resSimple.text();
          let parsed: any;
          try {
            parsed = JSON.parse(text);
          } catch {
            parsed = text;
          }
          liveAnswer = getAnswer(parsed);
        }
      } catch {
        // Fallback below
      }
    }

    if (liveAnswer) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: liveAnswer!,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      // Local knowledge assistant fallback with clean notice
      const localResponse = generateLocalStoreResponse(query, category);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `${localResponse}\n\n---\n*⚡ Note: Local n8n server at \`${CHAT_URL}\` was unreachable. Please verify your n8n workflow is running on port 5678 and listening on this path.*`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFallback: true,
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
        .replace(/\*(.*?)\*/g, '<em class="text-slate-500">$1</em>')
        .replace(
          /`([^`]+)`/g,
          '<code class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-blue-700">$1</code>'
        );

      return (
        <span
          key={idx}
          className="block min-h-[1.2em]"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div id="ai-chatbot-widget" className="chatbot-container relative z-50 font-sans" data-widget="novi">
      {/* Floating Launcher Button */}
      <button
        id="novi-launcher"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close Novi chat' : 'Open Novi chat'}
        aria-expanded={isOpen}
        className={`fixed right-5 sm:right-6 bottom-[84px] z-[99999] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-blue-300/60 cursor-pointer ${
          isOpen
            ? 'bg-slate-800 rotate-90 shadow-slate-900/30'
            : 'bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 shadow-blue-500/40 hover:shadow-blue-600/50'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative flex items-center justify-center">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>
        )}
      </button>

      {/* Chat Window Panel */}
      <section
        id="novi-chat"
        aria-label="Novi customer support chat"
        className={`fixed right-4 bottom-[154px] sm:bottom-[154px] sm:right-6 z-[99999] w-[calc(100vw-2rem)] sm:w-[410px] h-[610px] max-h-[calc(85vh-154px)] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col text-slate-800 transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none translate-y-4'
        }`}
      >
        {/* Header - Clean, without any customer settings icon */}
        <header className="novi-header bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-5 py-3.5 flex items-center justify-between shadow-md relative select-none">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-lg shadow-inner">
                ✨
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-700 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <strong className="text-sm font-bold tracking-tight">Novi AI</strong>
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 bg-white/20 rounded text-blue-100">
                  Store Advisor
                </span>
              </div>
              <small className="text-[11px] text-blue-100/90 block flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online • Khizar Tech
              </small>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Clear / Restart Session */}
            <button
              onClick={handleClearChat}
              title="Reset conversation session"
              className="p-1.5 text-blue-100/80 hover:text-white hover:bg-white/15 rounded-xl transition-colors text-xs font-medium cursor-pointer"
              aria-label="Reset chat session"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Close Button */}
            <button
              id="novi-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="p-1.5 text-blue-100/80 hover:text-white hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Category Pills Bar */}
        <div className="novi-categories bg-slate-50/90 border-b border-slate-200/70 p-3 sm:px-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Choose inquiry type:</span>
            <small id="novi-selection" className="text-[11px] font-semibold text-blue-600">
              {category === 'products' ? '🛍️ Products & Sales' : category === 'faq' ? '📋 FAQs & Policies' : 'Select below'}
            </small>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`novi-category flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                category === 'products'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs shadow-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              data-category="products"
              onClick={() => selectCategory('products')}
            >
              <span>🛍️</span>
              <span className="truncate">Products & Sales</span>
            </button>
            <button
              className={`novi-category flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                category === 'faq'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs shadow-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              data-category="faq"
              onClick={() => selectCategory('faq')}
            >
              <span>📋</span>
              <span className="truncate">FAQs & Policies</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div
          id="novi-messages"
          aria-live="polite"
          className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-50/50 to-white"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`novi-message flex flex-col max-w-[88%] ${
                m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div
                className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs'
                    : m.isFallback
                    ? 'bg-white border border-amber-200 text-slate-800 rounded-bl-xs'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-slate-100'
                }`}
              >
                {renderFormattedText(m.text)}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">{m.time}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="novi-message bot mr-auto items-start max-w-[85%] animate-fadeIn">
              <div className="px-4 py-3 bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                <span className="text-xs text-slate-400 ml-1.5 font-medium">Novi is answering...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          id="novi-form"
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              id="novi-input"
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                category === 'products'
                  ? 'Ask about product 01, editions, prices...'
                  : category === 'faq'
                  ? 'Ask about Cash on Delivery, shipping, warranty...'
                  : 'Select a category first...'
              }
              autoComplete="off"
              disabled={!category || isTyping}
              className="w-full pl-3.5 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-80 disabled:bg-slate-100 disabled:border-slate-300 disabled:cursor-not-allowed"
            />
          </div>
          <button
            id="novi-send"
            type="submit"
            disabled={!category || !inputVal.trim() || isTyping}
            aria-label="Send message"
            className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 disabled:active:scale-100 disabled:cursor-not-allowed shadow-xs shadow-blue-500/30 cursor-pointer"
          >
            <svg
              className="w-4 h-4 transform rotate-45 -translate-y-0.5 -translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        {/* Footer - Clean, no settings button */}
        <div className="novi-footer bg-slate-50/80 border-t border-slate-100 py-2 px-4 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 font-medium">
          <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span>Powered by Novi AI • Connected to Khizar Tech Store</span>
        </div>
      </section>
    </div>
  );
};
