import React from 'react';
import { PRODUCTS } from '../data/products';

interface ProductVisualProps {
  productId: string;
  imageSrc?: string;
  name: string;
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  productId,
  imageSrc,
  name,
  className = 'w-full h-full object-cover',
}) => {
  // Resolve authentic photographic asset from prop or product registry
  const resolvedSrc = (imageSrc && !imageSrc.startsWith('svg:'))
    ? imageSrc
    : PRODUCTS.find((p) => p.id === productId)?.image;

  if (resolvedSrc && !resolvedSrc.startsWith('svg:')) {
    return (
      <img
        src={resolvedSrc}
        alt={name}
        referrerPolicy="no-referrer"
        className={className}
        loading="lazy"
      />
    );
  }

  // Bespoke high-precision technical illustrations for specific accessories and variants
  // Built with clean blue, white, silver, and titanium tones to match the fresh brand identity
  switch (productId) {
    case 'nexus-100w-braided-c2c':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50/80 via-white to-slate-100 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Coiled Braided Cable */}
            <path
              d="M 80 180 C 80 80, 320 80, 320 180 C 320 250, 100 250, 100 160 C 100 110, 280 110, 280 170"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
            <path
              d="M 80 180 C 80 80, 320 80, 320 180 C 320 250, 100 250, 100 160 C 100 110, 280 110, 280 170"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Connector Head Left */}
            <g transform="translate(60, 170) rotate(-15)">
              <rect x="0" y="0" width="40" height="20" rx="3" fill="#1e293b" />
              <rect x="40" y="3" width="16" height="14" rx="2" fill="#cbd5e1" />
              <text x="6" y="14" fill="#60a5fa" fontSize="7" fontFamily="monospace" fontWeight="bold">100W PD</text>
            </g>
            {/* Genuine Leather Strap Accent */}
            <rect x="190" y="70" width="22" height="42" rx="4" fill="#b45309" transform="rotate(8 190 70)" />
            <circle cx="201" cy="91" r="3" fill="#fef3c7" />
            {/* Connector Head Right */}
            <g transform="translate(260, 160) rotate(10)">
              <rect x="0" y="0" width="40" height="20" rx="3" fill="#1e293b" />
              <rect x="40" y="3" width="16" height="14" rx="2" fill="#cbd5e1" />
              <text x="8" y="14" fill="#94a3b8" fontSize="7" fontFamily="monospace">TYPE-C</text>
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50/90 px-1.5 py-0.5 rounded border border-blue-200">
            100W KEVLAR WEAVE
          </div>
        </div>
      );

    case 'nexus-90deg-gaming-usbc':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Phone Silhouette Edge */}
            <rect x="230" y="40" width="130" height="220" rx="16" fill="#0f172a" />
            <rect x="234" y="44" width="122" height="212" rx="14" fill="#1e293b" />
            <rect x="230" y="140" width="4" height="20" rx="1" fill="#38bdf8" />
            {/* 90-Degree Connector */}
            <path
              d="M 60 210 L 190 210 Q 210 210 210 190 L 210 150"
              fill="none"
              stroke="#0284c7"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 60 210 L 190 210 Q 210 210 210 190 L 210 150"
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />
            {/* L-Shaped Head */}
            <g transform="translate(195, 125)">
              <path d="M 0 10 L 25 10 L 25 35 L 12 35 L 12 25 L 0 25 Z" fill="#0f172a" />
              <rect x="25" y="15" width="12" height="12" rx="2" fill="#cbd5e1" />
              <circle cx="18" cy="18" r="2.5" fill="#38bdf8" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
            90° L-SHAPE GAMING
          </div>
        </div>
      );

    case 'nexus-silicone-c2lightning':
      return (
        <div className="w-full h-full bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Silky soft silicone curves */}
            <path
              d="M 70 120 C 120 70, 180 230, 240 130 C 270 80, 310 160, 340 180"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 70 120 C 120 70, 180 230, 240 130 C 270 80, 310 160, 340 180"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Lightning Head with Gold Pins */}
            <g transform="translate(45, 105) rotate(-35)">
              <rect x="0" y="0" width="36" height="18" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="-14" y="3" width="14" height="12" rx="1" fill="#e2e8f0" />
              {/* 8 Gold Pins */}
              <rect x="-10" y="5" width="2" height="8" fill="#f59e0b" />
              <rect x="-7" y="5" width="2" height="8" fill="#f59e0b" />
              <rect x="-4" y="5" width="2" height="8" fill="#f59e0b" />
            </g>
            {/* USB-C Head */}
            <g transform="translate(325, 170) rotate(15)">
              <rect x="0" y="0" width="36" height="18" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="36" y="3" width="14" height="12" rx="2" fill="#cbd5e1" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
            MFi LIQUID SILICONE
          </div>
        </div>
      );

    case 'nexus-4in1-universal-cable':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Braided Armor Line */}
            <path d="M 80 150 L 320 150" stroke="#475569" strokeWidth="12" strokeLinecap="round" strokeDasharray="3 3" />
            {/* Modular Adapter Head Left */}
            <g transform="translate(60, 130)">
              <rect x="0" y="0" width="35" height="40" rx="4" fill="#1e293b" />
              <rect x="-15" y="12" width="15" height="16" rx="2" fill="#94a3b8" />
              <circle cx="17" cy="12" r="3" fill="#38bdf8" />
              <circle cx="17" cy="28" r="3" fill="#cbd5e1" />
            </g>
            {/* Modular Adapter Head Right (Swappable C to Lightning) */}
            <g transform="translate(290, 130)">
              <rect x="0" y="0" width="35" height="40" rx="4" fill="#1e293b" />
              <rect x="35" y="12" width="16" height="16" rx="2" fill="#cbd5e1" />
              <rect x="42" y="8" width="10" height="24" rx="2" fill="#f8fafc" stroke="#94a3b8" />
            </g>
            {/* Tether cable loop */}
            <path d="M 285 135 C 270 100, 310 100, 320 125" fill="none" stroke="#64748b" strokeWidth="3" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            4-IN-1 MODULAR HEAD
          </div>
        </div>
      );

    case 'nexus-8k-usbc-to-hdmi':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Gold-plated HDMI Head */}
            <g transform="translate(80, 110)">
              <rect x="0" y="0" width="80" height="50" rx="5" fill="#0f172a" />
              <path d="M 80 12 L 105 12 L 115 20 L 115 38 L 105 44 L 80 44 Z" fill="#f59e0b" />
              <rect x="85" y="16" width="22" height="22" rx="1" fill="#78350f" />
              <text x="12" y="32" fill="#38bdf8" fontSize="12" fontFamily="sans-serif" fontWeight="bold">8K HDMI</text>
            </g>
            {/* Cable Lead */}
            <path d="M 80 135 Q 20 135 20 200 T 160 250 T 260 170" fill="none" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" />
            {/* USB-C Connector */}
            <g transform="translate(260, 155) rotate(20)">
              <rect x="0" y="0" width="50" height="24" rx="4" fill="#0f172a" />
              <rect x="50" y="4" width="16" height="16" rx="3" fill="#f59e0b" />
              <text x="6" y="16" fill="#e2e8f0" fontSize="8" fontFamily="monospace">TYPE-C</text>
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            8K@60Hz / 4K@144Hz
          </div>
        </div>
      );

    case 'nexus-usba-to-usbc-10gbps':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* USB-A Head with Blue 3.2 Insulator */}
            <g transform="translate(80, 115)">
              <rect x="0" y="0" width="70" height="34" rx="4" fill="#1e293b" />
              <rect x="70" y="4" width="30" height="26" rx="2" fill="#e2e8f0" stroke="#94a3b8" />
              {/* Blue USB 3.2 tongue */}
              <rect x="78" y="12" width="18" height="10" rx="1" fill="#0284c7" />
              <text x="8" y="22" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">USB 3.2</text>
            </g>
            <path d="M 80 132 C 30 132 40 220 180 220 C 260 220 250 145 280 135" fill="none" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
            {/* Type-C Head */}
            <g transform="translate(280, 120)">
              <rect x="0" y="0" width="45" height="24" rx="4" fill="#1e293b" />
              <rect x="45" y="4" width="16" height="16" rx="2" fill="#cbd5e1" />
              <text x="6" y="16" fill="#38bdf8" fontSize="8" fontFamily="monospace">10Gbps</text>
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            10Gbps SUPER SPEED
          </div>
        </div>
      );

    case 'aerokev-aramid-case':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-xl">
            {/* Aramid Case Silhouette */}
            <rect x="130" y="30" width="140" height="240" rx="28" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Twill Carbon Weave Pattern */}
            <g opacity="0.35">
              {[...Array(24)].map((_, i) => (
                <line key={i} x1={120 + i * 8} y1="30" x2={160 + i * 8} y2="270" stroke="#60a5fa" strokeWidth="2" />
              ))}
            </g>
            {/* Raised Camera Island with Titanium Ring */}
            <rect x="145" y="45" width="55" height="60" rx="14" fill="#09090b" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="160" cy="62" r="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="160" cy="88" r="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="185" cy="75" r="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            {/* MagSafe Magnetic Ring Silhouette */}
            <circle cx="200" cy="160" r="38" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.8" />
            <rect x="198" y="204" width="4" height="14" rx="2" fill="#60a5fa" opacity="0.8" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-cyan-800">
            1500D BALLISTIC KEVLAR
          </div>
        </div>
      );

    case 'titan-armor-shockproof-case':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-lg">
            {/* Tactical Armor Case with Corner Dampers */}
            <rect x="125" y="25" width="150" height="250" rx="30" fill="#0f172a" />
            <rect x="135" y="35" width="130" height="230" rx="22" fill="#1e293b" />
            {/* Heavy-duty corner air bags */}
            <circle cx="135" cy="35" r="12" fill="#0284c7" opacity="0.8" />
            <circle cx="265" cy="35" r="12" fill="#0284c7" opacity="0.8" />
            <circle cx="135" cy="265" r="12" fill="#0284c7" opacity="0.8" />
            <circle cx="265" cy="265" r="12" fill="#0284c7" opacity="0.8" />
            {/* Metallic Buttons */}
            <rect x="121" y="80" width="4" height="24" rx="2" fill="#38bdf8" />
            <rect x="121" y="112" width="4" height="24" rx="2" fill="#38bdf8" />
            <rect x="275" y="95" width="4" height="32" rx="2" fill="#38bdf8" />
            {/* Center MagSafe Shield */}
            <circle cx="200" cy="150" r="34" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            15FT MIL-GRADE DROP
          </div>
        </div>
      );

    case 'frost-translucent-case':
      return (
        <div className="w-full h-full bg-gradient-to-br from-sky-50 via-white to-blue-100/60 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Frosted Translucent Body */}
            <rect x="130" y="30" width="140" height="240" rx="26" fill="#f8fafc" stroke="#93c5fd" strokeWidth="2" fillOpacity="0.85" />
            {/* Matte Frost Texture */}
            <rect x="145" y="45" width="55" height="58" rx="14" fill="#e0f2fe" stroke="#60a5fa" strokeWidth="1.5" />
            <circle cx="160" cy="62" r="8" fill="#bae6fd" />
            <circle cx="160" cy="86" r="8" fill="#bae6fd" />
            <circle cx="185" cy="74" r="8" fill="#bae6fd" />
            {/* Blue MagSafe Ring */}
            <circle cx="200" cy="155" r="36" fill="none" stroke="#2563eb" strokeWidth="3" opacity="0.6" />
            <rect x="198" y="197" width="4" height="14" rx="2" fill="#2563eb" opacity="0.6" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-white/90 px-1.5 py-0.5 rounded border border-blue-200">
            FROSTED MATTE SHELL
          </div>
        </div>
      );

    case 'sapphire-shield-screen-protector':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-sky-100 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Auto-Alignment Installation Tray (Green/Cyan frame) */}
            <rect x="100" y="20" width="200" height="260" rx="20" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="6 3" />
            {/* Tempered Glass Sheet hovering */}
            <rect x="130" y="45" width="140" height="210" rx="18" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" fillOpacity="0.8" />
            {/* Pull Tab */}
            <g transform="translate(160, 10)">
              <rect x="0" y="0" width="80" height="24" rx="4" fill="#22c55e" />
              <text x="12" y="16" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">PULL TAB</text>
            </g>
            {/* 9H+ Diamond Emblem */}
            <circle cx="200" cy="150" r="26" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
            <text x="187" y="156" fill="#0369a1" fontSize="16" fontFamily="sans-serif" fontWeight="bold">9H+</text>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            AUTO-ALIGNMENT TRAY
          </div>
        </div>
      );

    case 'titanium-camera-lens-protector':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Trio of Titanium Lens Rings */}
            <g transform="translate(110, 80)">
              <circle cx="50" cy="50" r="42" fill="#334155" stroke="#94a3b8" strokeWidth="4" />
              <circle cx="50" cy="50" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="42" cy="42" r="8" fill="#ffffff" opacity="0.4" />
            </g>
            <g transform="translate(210, 80)">
              <circle cx="50" cy="50" r="42" fill="#334155" stroke="#94a3b8" strokeWidth="4" />
              <circle cx="50" cy="50" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="42" cy="42" r="8" fill="#ffffff" opacity="0.4" />
            </g>
            <g transform="translate(160, 160)">
              <circle cx="50" cy="50" r="42" fill="#334155" stroke="#94a3b8" strokeWidth="4" />
              <circle cx="50" cy="50" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="42" cy="42" r="8" fill="#ffffff" opacity="0.4" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
            SAPPHIRE OPTICAL RINGS
          </div>
        </div>
      );

    case 'orbit-aluminum-magsafe-stand':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50/60 via-white to-slate-100 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-lg">
            {/* Weighted Heavy Brass Base */}
            <ellipse cx="200" cy="240" rx="90" ry="24" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <ellipse cx="200" cy="235" rx="85" ry="20" fill="#f8fafc" />
            {/* CNC Aluminum Stem */}
            <path d="M 194 235 L 194 110 L 206 110 L 206 235 Z" fill="#94a3b8" />
            {/* MagSafe Angled Puck Head */}
            <g transform="translate(200, 95) rotate(-22)">
              <ellipse cx="0" cy="0" rx="45" ry="45" fill="#f8fafc" stroke="#3b82f6" strokeWidth="3" />
              <circle cx="0" cy="0" r="28" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 3" />
              <circle cx="0" cy="0" r="6" fill="#3b82f6" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            PRECISION CNC BRASS CORE
          </div>
        </div>
      );

    case 'vertex-10in1-hub':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Aluminum Fin Enclosure */}
            <rect x="70" y="80" width="260" height="140" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            {/* Ports row 1 */}
            <rect x="95" y="105" width="28" height="18" rx="2" fill="#0f172a" stroke="#64748b" />
            <rect x="135" y="105" width="28" height="18" rx="2" fill="#0f172a" stroke="#64748b" />
            <rect x="175" y="105" width="22" height="14" rx="2" fill="#0284c7" />
            <rect x="210" y="105" width="22" height="14" rx="2" fill="#0284c7" />
            {/* SD slots */}
            <rect x="245" y="108" width="35" height="4" rx="1" fill="#cbd5e1" />
            <rect x="245" y="118" width="20" height="3" rx="1" fill="#cbd5e1" />
            {/* 2.5G Ethernet */}
            <path d="M 95 150 L 125 150 L 125 168 L 118 168 L 118 174 L 102 174 L 102 168 L 95 168 Z" fill="#0f172a" stroke="#64748b" />
            {/* LED Status */}
            <circle cx="295" cy="115" r="3" fill="#38bdf8" />
            <text x="140" y="195" fill="#94a3b8" fontSize="12" fontFamily="monospace" fontWeight="bold">10-IN-1 THUNDERBOLT 4</text>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            DUAL 4K / 2.5G ETHERNET
          </div>
        </div>
      );

    case 'kinetic-laptop-riser':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50/50 via-white to-slate-100 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Flat Aluminum Base */}
            <rect x="90" y="220" width="220" height="14" rx="4" fill="#cbd5e1" stroke="#94a3b8" />
            {/* Dual Steel Hinges & Lift Arms */}
            <circle cx="120" cy="227" r="7" fill="#2563eb" />
            <circle cx="280" cy="227" r="7" fill="#2563eb" />
            <line x1="120" y1="227" x2="150" y2="120" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
            <line x1="280" y1="227" x2="250" y2="120" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
            {/* Top Ventilated Laptop Platform */}
            <g transform="translate(100, 95) rotate(-14)">
              <rect x="0" y="0" width="210" height="24" rx="5" fill="#f8fafc" stroke="#2563eb" strokeWidth="2" />
              <rect x="195" y="-12" width="12" height="12" rx="2" fill="#2563eb" />
              <line x1="40" y1="12" x2="160" y2="12" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 8" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            DUAL-PIVOT 10KG LOAD
          </div>
        </div>
      );

    case 'nexus-magnetic-cable-blocks':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Three Weighted Blocks with Magnetic Collars */}
            <g transform="translate(80, 140)">
              <rect x="0" y="0" width="60" height="35" rx="6" fill="#1e293b" />
              <circle cx="30" cy="17" r="8" fill="#38bdf8" />
              <line x1="30" y1="0" x2="30" y2="35" stroke="#0f172a" strokeWidth="3" />
            </g>
            <g transform="translate(170, 120)">
              <rect x="0" y="0" width="60" height="35" rx="6" fill="#2563eb" />
              <circle cx="30" cy="17" r="8" fill="#ffffff" />
              <line x1="30" y1="0" x2="30" y2="35" stroke="#1d4ed8" strokeWidth="3" />
            </g>
            <g transform="translate(260, 140)">
              <rect x="0" y="0" width="60" height="35" rx="6" fill="#64748b" />
              <circle cx="30" cy="17" r="8" fill="#38bdf8" />
              <line x1="30" y1="0" x2="30" y2="35" stroke="#475569" strokeWidth="3" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            NANO-SUCTION BLOCKS (3-PACK)
          </div>
        </div>
      );

    case 'volt-65w-travel-brick':
      return (
        <div className="w-full h-full bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Compact GaN Travel Cube */}
            <rect x="140" y="70" width="120" height="140" rx="16" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
            {/* Dual Type-C Ports */}
            <rect x="180" y="105" width="40" height="14" rx="4" fill="#0f172a" />
            <rect x="180" y="145" width="40" height="14" rx="4" fill="#0f172a" />
            <text x="175" y="132" fill="#2563eb" fontSize="8" fontFamily="monospace" fontWeight="bold">USB-C 1 (65W)</text>
            <text x="175" y="172" fill="#64748b" fontSize="8" fontFamily="monospace">USB-C 2 (20W)</text>
            {/* Folding Prongs on bottom */}
            <rect x="170" y="210" width="14" height="24" rx="2" fill="#cbd5e1" />
            <rect x="216" y="210" width="14" height="24" rx="2" fill="#cbd5e1" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            65W GaN DUAL TRAVEL CUBE
          </div>
        </div>
      );

    case 'volt-45w-ultraslim-wallpuck':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Ultra-slim 14mm Flat Puck */}
            <ellipse cx="200" cy="140" rx="100" ry="60" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2.5" />
            <ellipse cx="200" cy="135" rx="90" ry="50" fill="#f8fafc" />
            {/* Down-angled port slot */}
            <rect x="175" y="145" width="50" height="14" rx="3" fill="#0f172a" />
            <text x="182" y="125" fill="#0284c7" fontSize="14" fontFamily="monospace" fontWeight="bold">45W GaN</text>
            <text x="168" y="175" fill="#64748b" fontSize="8" fontFamily="sans-serif">14mm Flush Profile</text>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
            14MM FLUSH WALL PUCK
          </div>
        </div>
      );

    case 'volt-15w-qi2-car-charger':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Circular Magnetic Face with Cryo-Boost Fan Grille */}
            <circle cx="200" cy="130" r="65" fill="#0f172a" stroke="#2563eb" strokeWidth="3" />
            <circle cx="200" cy="130" r="45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
            {/* Cooling vents */}
            <circle cx="200" cy="130" r="22" fill="#1e293b" />
            <line x1="200" y1="112" x2="200" y2="148" stroke="#38bdf8" strokeWidth="2" />
            <line x1="182" y1="130" x2="218" y2="130" stroke="#38bdf8" strokeWidth="2" />
            {/* Heavy-duty steel vent hook */}
            <rect x="194" y="195" width="12" height="40" rx="3" fill="#64748b" />
            <circle cx="200" cy="205" r="8" fill="#475569" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            QI2 15W ACTIVE COOLING
          </div>
        </div>
      );

    case 'airpods-pro-titanium':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-lg">
            {/* MagSafe White Charging Case with Titanium Accents */}
            <rect x="135" y="90" width="130" height="95" rx="34" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="135" y1="125" x2="265" y2="125" stroke="#e2e8f0" strokeWidth="1.5" />
            <circle cx="200" cy="145" r="2.5" fill="#22c55e" />
            {/* Earbuds Left & Right in Front */}
            <g transform="translate(100, 160)">
              <ellipse cx="20" cy="20" rx="16" ry="14" fill="#f8fafc" stroke="#cbd5e1" />
              <rect x="14" y="30" width="8" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
              <rect x="14" y="55" width="8" height="5" fill="#38bdf8" />
            </g>
            <g transform="translate(260, 160)">
              <ellipse cx="20" cy="20" rx="16" ry="14" fill="#f8fafc" stroke="#cbd5e1" />
              <rect x="18" y="30" width="8" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
              <rect x="18" y="55" width="8" height="5" fill="#38bdf8" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
            AIRPODS PRO MASTER
          </div>
        </div>
      );

    case 'precision-silicone-eartips':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-md">
            {/* Presentation Tray */}
            <rect x="80" y="50" width="240" height="190" rx="16" fill="#ffffff" stroke="#bfdbfe" strokeWidth="2" />
            <text x="110" y="80" fill="#1e40af" fontSize="11" fontFamily="sans-serif" fontWeight="bold">ACOUSTIC DUAL-SEAL KIT</text>
            {/* 6 Pairs of Silicone & Foam Tips */}
            {[
              { cx: 120, cy: 125, r: 16, label: 'S' },
              { cx: 200, cy: 125, r: 20, label: 'M' },
              { cx: 280, cy: 125, r: 24, label: 'L' },
              { cx: 120, cy: 185, r: 16, label: 'S' },
              { cx: 200, cy: 185, r: 20, label: 'M' },
              { cx: 280, cy: 185, r: 24, label: 'L' },
            ].map((tip, idx) => (
              <g key={idx}>
                <circle cx={tip.cx} cy={tip.cy} r={tip.r} fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <circle cx={tip.cx} cy={tip.cy} r={tip.r * 0.45} fill="#3b82f6" />
                <text x={tip.cx - 4} y={tip.cy + 3} fill="#ffffff" fontSize="8" fontFamily="monospace">{tip.label}</text>
              </g>
            ))}
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            6 PAIRS MEMORY FOAM & SILICONE
          </div>
        </div>
      );

    case 'carbon-airpods-pro-case':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-xl">
            {/* Carbon Fiber Clamshell Case */}
            <rect x="130" y="85" width="140" height="110" rx="28" fill="#18181b" stroke="#38bdf8" strokeWidth="2" />
            <line x1="130" y1="130" x2="270" y2="130" stroke="#38bdf8" strokeWidth="1" />
            {/* Diagonal weave lines */}
            <g opacity="0.4">
              {[...Array(14)].map((_, i) => (
                <line key={i} x1={120 + i * 12} y1="85" x2={160 + i * 12} y2="195" stroke="#60a5fa" strokeWidth="2" />
              ))}
            </g>
            {/* Carabiner Titanium Ring */}
            <circle cx="280" cy="140" r="14" fill="none" stroke="#94a3b8" strokeWidth="4" />
            <rect x="290" y="132" width="4" height="16" fill="#38bdf8" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-cyan-800">
            1500D ARAMID AIRPODS SHIELD
          </div>
        </div>
      );

    case 'apex-studio-cinema-edition':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-900 to-black flex items-center justify-center p-6 select-none relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 filter drop-shadow-xl">
            {/* Cinema Phone Back */}
            <rect x="130" y="30" width="140" height="240" rx="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Pro Cinema Camera Module with Mechanical Ring */}
            <rect x="142" y="45" width="116" height="85" rx="16" fill="#18181b" stroke="#94a3b8" strokeWidth="2" />
            {/* Large 1-inch sensor lens */}
            <circle cx="175" cy="85" r="24" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="175" cy="85" r="14" fill="#0c4a6e" />
            <circle cx="170" cy="80" r="5" fill="#ffffff" opacity="0.6" />
            {/* Secondary Periscope */}
            <rect x="215" y="72" width="24" height="24" rx="6" fill="#0284c7" />
            {/* Laser Autofocus and Flash */}
            <circle cx="227" cy="110" r="4" fill="#f59e0b" />
            <text x="145" y="240" fill="#38bdf8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">4K 120FPS PRORES</text>
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-sky-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-sky-700">
            PRORES CINEMA 1TB
          </div>
        </div>
      );

    default:
      // Elegant fallback with blue/white tech card styling
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-slate-100 flex flex-col items-center justify-center p-6 select-none">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-2">
            KT
          </div>
          <span className="text-xs font-semibold text-slate-800 text-center max-w-[80%] line-clamp-1">{name}</span>
          <span className="text-[10px] text-blue-600 font-mono mt-0.5">Khizar Tech Certified</span>
        </div>
      );
  }
};
