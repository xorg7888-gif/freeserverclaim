import React from 'react';
import { Shield, Sparkles, Cpu, Layers, Disc, Globe, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  user: { id: number; email: string } | null;
  claim: any;
  onChangeTab: (tab: string) => void;
}

export default function LandingPage({ user, claim, onChangeTab }: LandingPageProps) {
  return (
    <div className="space-y-20 py-8 md:py-16" id="hdx-landing-page">
      
      {/* Dynamic Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4" id="section-hero">
        {/* Banner Badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-purple-500/30 bg-purple-950/30 px-4 py-1.5 text-xs text-purple-300 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-bounce" id="badge-promo">
          <Sparkles className="h-4.5 w-4.5 text-purple-400" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">Season 4 Token claims are live</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl" id="hero-title">
          <span className="block font-sans">NEXT-GEN MINECRAFT</span>
          <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 bg-clip-text text-transparent font-sans italic tracking-wide">
            ENTERPRISE CLOUD
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium" id="hero-description">
          Experience low latency, high capacity performance. Claim your exclusive server validation token to activate server nodes, claim database access, and link premium Minecraft accounts across our distributed physical cloud infrastructure.
        </p>

        {/* Call-to-actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4" id="hero-ctas">
          {user ? (
            <button
              onClick={() => onChangeTab('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
              id="cta-go-dashboard"
            >
              <span>Access Your Claims Dashboard</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onChangeTab('signup')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
                id="cta-join-free"
              >
                <span>Create Secure Profile</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => onChangeTab('login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-300 bg-slate-900/60 hover:bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:text-white hover:scale-[1.02] transition-all"
                id="cta-sign-in"
              >
                Sign In to Account
              </button>
            </>
          )}
        </div>
      </section>

      {/* Feature Hardware Specifications Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="section-hardware">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Premium Architecture</p>
          <h2 className="text-2xl font-extrabold text-white mt-1">Why Developers Choose HDX-CLOUD</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" id="hardware-grid">
          {/* Card 1 */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] hover:-translate-y-1" id="card-hw-cpu">
            <div className="absolute top-0 right-0 h-24 w-24 bg-cyan-500/5 blur-2xl rounded-full" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-950/50 text-cyan-400 mb-5">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Ryzen 9 7950X3D Cores</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Powered by massive 3D V-Cache systems to render intense chunk sizes and heavy modpacks without processing hitches.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.08)] hover:-translate-y-1" id="card-hw-ram">
            <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/5 blur-2xl rounded-full" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-950/50 text-teal-400 mb-5">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">DDR5 High-Frequency RAM</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Equipped with elite speed registers ensuring high capacity memory access with sub-nanosecond response times.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.08)] hover:-translate-y-1" id="card-hw-ddos">
            <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/5 blur-2xl rounded-full" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-950/50 text-purple-400 mb-5">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">DDoS Mitigation Array</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Enterprise layers designed to block real-time attacks continuously, shielding server connections on standard port allocations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] hover:-translate-y-1" id="card-hw-network">
            <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 blur-2xl rounded-full" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-950/50 text-violet-400 mb-5">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Global Backhaul Network</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Distributed locations around Europe and America for premium low latency ping scores irrespective of client location.
            </p>
          </div>
        </div>
      </section>

      {/* "How It Works" Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-16" id="section-how-it-works">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400">Validation Protocol</p>
          <h2 className="text-2xl font-extrabold text-white mt-1">Claim Process Workflow</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="workflow-cards">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center p-6 bg-slate-950/60 border border-slate-900 rounded-2xl shadow-md" id="step-one-card">
            <span className="absolute top-4 left-4 font-mono font-black text-slate-800 text-3xl">01</span>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-bold my-4">
              HDX
            </div>
            <h3 className="text-md font-bold text-slate-100">Join HDX Portal</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-xs">
              First registers accounts securely in the system. Password encryption guarantees full privacy.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center p-6 bg-slate-950/60 border border-slate-900 rounded-2xl shadow-md" id="step-two-card">
            <span className="absolute top-4 left-4 font-mono font-black text-slate-800 text-3xl">02</span>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-400 text-xs font-bold my-4 animate-pulse">
              SYS
            </div>
            <h3 className="text-md font-bold text-slate-100">IP Verification Check</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-xs">
              One claim limit per IP prevents duplicate bots. The portal registers secure sessions and client IPs instantly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center p-6 bg-slate-950/60 border border-slate-900 rounded-2xl shadow-md" id="step-three-card">
            <span className="absolute top-4 left-4 font-mono font-black text-slate-800 text-3xl">03</span>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-400 text-xs font-bold my-4">
              99%
            </div>
            <h3 className="text-md font-bold text-slate-100">Claim Code Generation</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-xs">
              Generate a unique 6-digit server pass token. Copy this key and wait for our administrators' manual review approval check.
            </p>
          </div>
        </div>
      </section>

      {/* Minecraft Theme Server Specs Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-16 pb-8" id="section-highlights">
        <div className="rounded-3xl border border-cyan-500/10 bg-gradient-to-r from-slate-950 via-cyan-950/10 to-slate-950 p-8 md:p-12 shadow-2xl relative overflow-hidden" id="card-immersive-highlight">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="grid-highlight-content">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 border border-cyan-400/25 px-2.5 py-1 rounded-md">Enterprise Standard</span>
              <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                Built specifically for Minecraft Pro-Gamers and Creators.
              </h2>
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                HDX-CLOUD is not simple shared server hosting. We run complete bare-metal isolated virtualization segments, granting administrators root access alongside real DDoS resilience to withstand intense server traffic.
              </p>
              
              <ul className="mt-6 space-y-3" id="feature-highlights-list">
                <li className="flex items-start space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400 mr-1 mt-0.5" />
                  <span>Dedicated virtual environments with persistent thread allocation.</span>
                </li>
                <li className="flex items-start space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400 mr-1 mt-0.5" />
                  <span>Instant plugin configurations, including paper, slate, purge, and purpur.</span>
                </li>
                <li className="flex items-start space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400 mr-1 mt-0.5" />
                  <span>Interactive web terminal command prompts for remote admin controls.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center" id="graphic-highlight">
              <div className="relative p-6 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-xl max-w-sm w-full font-mono text-xs text-cyan-500 space-y-2">
                <div className="flex items-center space-x-2 border-b border-slate-900 pb-3 mb-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-[9px] text-slate-500 ml-2">hdx-sys-diagnostic.sh</span>
                </div>
                <p className="text-slate-500 text-[10px]">// DIAGNOSTIC STATUS INITIATED</p>
                <p className="text-slate-200"># hdxctl show-node --all</p>
                <p className="text-emerald-400">▶ NODE_WEST_EUROPE: ONLINE (1.2ms latency)</p>
                <p className="text-emerald-400">▶ NODE_NORTH_AMERICA: ONLINE (11.8ms latency)</p>
                <p className="text-cyan-400">▶ HOST_CORES: Ryzen 9 7950X3D (16 physical cores)</p>
                <p className="text-cyan-400">▶ MEMORY_ALLOCATED: 128GB DDR5 ECC Registered</p>
                <p className="text-cyan-400">▶ SYSTEM_SECURITY: DDoS-Shield Active (160Gbps ceiling)</p>
                <p className="text-purple-400 animate-pulse">▶ CLIENT_VALIDATION_ACTIVE: Listening on port 3000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
