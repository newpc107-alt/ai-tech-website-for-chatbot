import React from 'react';
import { useStore } from '../context/StoreContext';
import { Cpu, Shield, Zap, Sparkles, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => navigateTo({ name: 'home' })}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Home
        </button>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">Engineering & Metallurgy</span>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-12 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl space-y-4 z-10 relative">
          <div className="text-xs uppercase tracking-widest text-sky-400 font-semibold font-mono">
            Khizar Tech Store · Hardware Philosophy
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
            The Physics of Precision.
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Founded by Khizar. We reject cheap plastics and fragile cords. Every piece of hardware is built from aerospace-grade elements: pure beryllium acoustic foils, GaN III gallium nitride semiconductors, and 1500D ballistic aramid weaves.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Engineering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            GaN III Pro Semiconductor Physics
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Conventional silicon power supplies hit thermal saturation above 65W in compact formats. Gallium Nitride (GaN) features a bandgap three times wider than silicon, allowing our 140W desktop power stations to operate 40°C cooler while shrinking footprint by 58%.
          </p>
          <div className="pt-2 text-xs font-mono text-blue-600 font-semibold">
            Efficiency: 96.2% · Over-voltage protection: 0.002ms trip time
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Grade 5 Aerospace Titanium (Ti-6Al-4V)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Used in jet turbine rotors and surgical implants. Alloyed with 6% aluminum and 4% vanadium, delivering 1,100 MPa tensile strength while remaining 45% lighter than stainless steel. Every APEX chassis is 5-axis CNC milled for 180 minutes.
          </p>
          <div className="pt-2 text-xs font-mono text-blue-600 font-semibold">
            Hardness: 36 HRC · Natural passive oxide passivation layer
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            240W Extended Power Range & Thunderbolt 4
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our NEXUS cables incorporate dual Intel E-Marker chips and coaxial micro-shielded copper wires to sustain 48V/5A charging safely without voltage drop over 2 meters. Reinforced with DuPont Kevlar to endure 50,000 bend cycles.
          </p>
          <div className="pt-2 text-xs font-mono text-blue-600 font-semibold">
            Bandwidth: 40Gbps bidirectional · Display: Up to 8K@60Hz
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            1500D Ballistic Aramid Fiber Weaves
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vacuum formed in high-pressure autoclaves to create protective shells just 0.7mm thick and 12 grams in weight. Zero signal interference with 5G mmWave antennas or Qi2 magnetic induction rings.
          </p>
          <div className="pt-2 text-xs font-mono text-blue-600 font-semibold">
            Tensile Strength: 5x stronger than structural steel
          </div>
        </div>
      </div>

      {/* Lab Certification Callout */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Khizar Tech 2-Year Comprehensive Warranty</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If any charger, cable, or audio unit fails under normal daily workflow conditions within 730 days of delivery, Khizar Tech dispatches a brand-new replacement immediately with zero hassle.
          </p>
        </div>

        <button
          onClick={() => navigateTo({ name: 'accessories' })}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Explore All Hardware</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
