import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, Terminal, Eye, BrainCircuit, Play, Sparkles, BookOpen, 
  RotateCcw, History, ArrowRight, CheckCircle2, ShieldAlert
} from 'lucide-react';

export default function AboutWeb() {
  const steps = [
    {
      title: "Interactive Roadmap Lessons",
      desc: "Each lesson provides clear step-by-step guidance starting with foundational concepts, terminal challenges, and direct validation checks.",
      icon: BookOpen,
      color: "text-[#7c3aed] bg-[#f5f3ff] border-[#ede9fe]"
    },
    {
      title: "Live Terminal Emulator",
      desc: "An isolated command-line terminal simulator capable of executing real Git syntax such as init, status, add, commit, branch, and merge.",
      icon: Terminal,
      color: "text-[#d97706] bg-[#fffbeb] border-[#fef3c7]"
    },
    {
      title: "Interactive Graph Visualizer",
      desc: "Watch your directory tree and commit ledger rebuild in real-time as you type commands! Visualize staging branches and history instantly.",
      icon: Eye,
      color: "text-[#16a34a] bg-[#f0fdf4] border-[#bbf7d0]"
    },
    {
      title: "AI Companion Turing",
      desc: "Stuck with a command or want to understand what a merge conflict is? Ask Turing anytime on the side-panel for instant context.",
      icon: BrainCircuit,
      color: "text-[#9333ea] bg-[#faf5ff] border-[#f3e8ff]"
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-2 px-1 text-[#0f172a] font-sans" id="about-web-container">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7c3aed]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#a855f7]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#f5f3ff] border border-[#ede9fe] px-3 py-1 rounded-full text-[11px] font-mono font-bold text-[#7c3aed]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW IT WORKS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight leading-none font-sans">
            Welcome to the GitMaster Academy
          </h1>
          <p className="text-[#64748b] text-xs sm:text-sm leading-relaxed max-w-xl">
            GitMaster is an interactive simulated learning platform built to demystify Git. 
            No more dry lectures or dangerous terminal test-runs. We combine isolated simulations, 
            live visualization, and interactive lessons into one web sandbox!
          </p>
        </div>

        {/* Visual Badge Frame */}
        <div className="shrink-0 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] rounded-2xl opacity-10 blur-lg group-hover:opacity-20 transition-opacity"></div>
          <div className="relative bg-[#f8fafc] border border-[#e2e8f0] p-6 rounded-2xl flex flex-col items-center justify-center gap-3 text-center w-48 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#f5f3ff] border border-[#ddd6fe] flex items-center justify-center text-[#7c3aed]">
              <Terminal className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-[#64748b]">APP VERSION</div>
            <div className="text-xs font-bold text-[#0f172a]">v1.2.0 (Stable)</div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
        </div>
      </div>

      {/* SECTION: What is the Sandbox Arena? */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-7 bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#7c3aed]">
              <Terminal className="w-5 h-5" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider font-mono">
                The Sandbox Arena
              </h2>
            </div>
            
            <h3 className="text-lg font-bold text-[#0f172a]">What is this Sandbox Arena?</h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              The <strong>Sandbox Arena</strong> is your unguided, raw playground! In contrast to our roadmap lessons which direct you step-by-step, the Sandbox Arena starts you off with a blank sheet where you have complete freedom.
            </p>

            <ul className="space-y-3 mt-4 text-xs text-[#334155]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                <span><strong>No Rules Testbed:</strong> Type any command sequence, create custom files like <code>readme.md</code> or <code>app.js</code>, and build a massive multi-commit tree.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                <span><strong>Interactive Creation Panel:</strong> Add modifications manually with the file layout generator, or use mock stash and clones.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                <span><strong>Full Graphic Syncing:</strong> Your custom branch histories, merges, file staging, and logs draw automatically in real-time.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] font-mono text-[#64748b]">
            <span>Try commands like: <code>git checkout -b feature</code></span>
            <span className="text-[#7c3aed] font-bold">Playground Active</span>
          </div>
        </div>

        {/* Dynamic Interactive GIF/Image Representation */}
        <div className="md:col-span-5 bg-[#ffffff] border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between relative">
          <img 
            src="https://picsum.photos/seed/gitplayground/600/400" 
            alt="Git Sandbox illustration" 
            className="w-full h-44 object-cover opacity-80 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="p-6 space-y-2">
            <h4 className="text-xs font-bold text-[#7c3aed] font-mono uppercase tracking-widest">Live Visual Feed</h4>
            <p className="text-[11px] text-[#64748b] leading-normal">
              The Sandbox acts as a perfect mental-model mirror. Every state check matches exactly what true Git tracks behind the scenes.
            </p>
          </div>
          <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 text-[9px] px-2.5 py-1 rounded-md font-mono text-emerald-400 font-bold">
            ● SIMULATED WORKSPACE
          </div>
        </div>
      </div>

      {/* SECTION: Core App Framework Components */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#64748b] text-center">
          Our Interactive Engine Overview
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st, idx) => {
            const IconComponent = st.icon;
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-[#ffffff] border border-[#e2e8f0] p-5 rounded-2xl shadow-sm hover:border-[#ddd6fe] hover:shadow-md transition-all flex flex-col justify-between h-48"
              >
                <div className="space-y-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${st.color}`}>
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#0f172a] tracking-wide">{st.title}</h4>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">{st.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION: Terminal command quick demonstration cards */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4 mb-6">
          <div>
            <h3 className="font-bold text-[#0f172a] text-sm uppercase tracking-wider font-mono">Simulating Git Under The Hood</h3>
            <p className="text-[11px] text-[#64748b] mt-1">Our system mimics exact branch and commit trees on top of a virtual JSON filesystem.</p>
          </div>
          <span className="text-[9px] font-mono text-[#15803d] bg-[#f0fdf4] px-2.5 py-1 rounded-full border border-[#bbf7d0] font-bold shrink-0">
            Secure client-side sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px] text-[#334155]">
          <div className="space-y-2 bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#7c3aed] font-bold">1. INIT FILESYSTEM</span>
            <p className="text-[#64748b] text-[9px] leading-relaxed">
              When you call <code>git init</code>, a tracker instantiates and monitors changes in the working directory array.
            </p>
          </div>

          <div className="space-y-2 bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#7c3aed] font-bold">2. STAGING INDEX</span>
            <p className="text-[#64748b] text-[9px] leading-relaxed">
              When you call <code>git add</code>, file revisions copy into a virtual staging array (your staging index).
            </p>
          </div>

          <div className="space-y-2 bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#7c3aed] font-bold">3. TIMELINE SNAPSHOTS</span>
            <p className="text-[#64748b] text-[9px] leading-relaxed">
              When you call <code>git commit</code>, a cryptographically signed parent-child snapshot stores the node tree forever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
