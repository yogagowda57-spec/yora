import { useState } from 'react';
import { RepoState } from '../types';
import Terminal from './Terminal';
import Visualizer from './Visualizer';
import AITutor from './AITutor';
import { Play, RotateCcw, AlertCircle, HelpCircle, TerminalSquare, CheckCircle, AlertTriangle } from 'lucide-react';

const SANDBOX_START_STATE: RepoState = {
  isInitialized: true,
  workingDirectory: [
    { name: 'index.html', content: '<h1>My Kitten Sanctuary</h1>', status: 'untracked' },
    { name: 'styles.css', content: 'body { background: pink; }', status: 'untracked' },
    { name: 'app.js', content: 'console.log("Kittens loaded!");', status: 'untracked' }
  ],
  stagingArea: [],
  commits: [],
  currentBranch: 'main',
  branches: ['main'],
  remoteCommits: [],
  remoteBranches: []
};

export default function Sandbox() {
  const [sandboxState, setSandboxState] = useState<RepoState>({ ...SANDBOX_START_STATE });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const handleConfirmReset = () => {
    setSandboxState({ ...SANDBOX_START_STATE });
    setShowResetModal(false);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6" id="sandbox-view">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#ffffff] p-4 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <h2 className="text-sm font-extrabold text-[#0f172a] flex items-center gap-2 uppercase tracking-wide">
            <TerminalSquare className="w-4.5 h-4.5 text-[#7c3aed]" />
            <span>Git Sandbox Arena</span>
          </h2>
          <p className="text-xs text-[#64748b] mt-1">
            Type any git commands you like! Watch your changes jump across different states of the visualizer below.
          </p>
        </div>
        <button
          onClick={() => setShowResetModal(true)}
          className="px-3.5 py-1.5 bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] text-xs text-[#dc2626] font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Sandbox
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in select-none">
          <div className="bg-[#ffffff] border border-[#e2e8f0] max-w-sm w-full p-5 rounded-2xl shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#dc2626]">
              <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4.5 h-4.5 text-[#dc2626]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#0f172a]">Reset Sandbox State?</h3>
                <p className="text-[11px] text-[#64748b]">Wipes test commits &amp; restores files.</p>
              </div>
            </div>

            <p className="text-xs text-[#64748b] leading-relaxed">
              This will restore the starter files (<code>index.html</code>, <code>styles.css</code>, <code>app.js</code>) and reset the working directory tree.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-1">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] font-bold text-xs rounded-xl cursor-pointer border border-[#e2e8f0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yes, Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {resetToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#15803d] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-mono">
          <CheckCircle className="w-4 h-4" />
          <span>Sandbox environment reset!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visualizer & Terminal Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Visualizer repoState={sandboxState} />
          
          <Terminal 
            repoState={sandboxState}
            setRepoState={setSandboxState}
          />
        </div>

        {/* AI Tutor Companion Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AITutor />
          
          {/* Quick Sandbox Tip */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-5 shadow-sm text-xs leading-relaxed text-[#64748b]">
            <h4 className="font-bold text-[#0f172a] mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <HelpCircle className="w-4 h-4 text-[#7c3aed]" /> Sandbox Commands:
            </h4>
            <ul className="flex flex-col gap-1.5 mt-2 font-mono text-[11px] text-[#334155]">
              <li className="bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">git status</li>
              <li className="bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">git add index.html</li>
              <li className="bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">git status</li>
              <li className="bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">git commit -m "My first commit!"</li>
              <li className="bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">git log</li>
              <li className="bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">git branch feature-kittens</li>
              <li className="bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">git checkout feature-kittens</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
