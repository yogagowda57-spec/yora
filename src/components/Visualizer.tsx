import { RepoState, VirtualFile, Commit } from '../types';
import { Folder, Inbox, Database, ArrowRight, Shield, Globe, Terminal, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface VisualizerProps {
  repoState: RepoState;
}

export default function Visualizer({ repoState }: VisualizerProps) {
  const { isInitialized, workingDirectory, stagingArea, commits, currentBranch, branches } = repoState;

  // Group files by status
  const untrackedFiles = workingDirectory.filter(f => f.status === 'untracked');
  const modifiedFiles = workingDirectory.filter(f => f.status === 'modified');
  const stagedFiles = workingDirectory.filter(f => f.status === 'staged');
  const committedFiles = workingDirectory.filter(f => f.status === 'committed');

  return (
    <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-5 shadow-sm flex flex-col gap-5" id="repo-visualizer">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4.5 h-4.5 text-[#7c3aed]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#0f172a]">Interactive Repository State</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 bg-[#f5f3ff] text-[#7c3aed] rounded-lg border border-[#ddd6fe]">
            Branch: <strong className="font-bold">{isInitialized ? currentBranch : 'None'}</strong>
          </span>
          <span className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-[#16a34a] animate-pulse' : 'bg-[#cbd5e1]'}`}></span>
          <span className="text-[11px] font-mono text-[#64748b] font-medium">
            {isInitialized ? 'Git Active' : 'Not Initialized'}
          </span>
        </div>
      </div>

      {!isInitialized ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-[#64748b]">
          <Terminal className="w-10 h-10 text-[#cbd5e1] mb-3 animate-pulse" />
          <p className="font-bold text-[#0f172a] text-xs">Git repository is not active.</p>
          <p className="text-[11px] max-w-xs mt-1.5 text-[#64748b]">
            Type <code className="bg-[#f8fafc] px-1.5 py-0.5 rounded border border-[#e2e8f0] text-[#7c3aed] font-mono text-[10px] font-bold">git init</code> in the terminal to unlock the local workspace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: Working Directory */}
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] flex flex-col gap-3 min-h-[220px]">
            <div className="flex items-center gap-1.5 text-[#0f172a] font-bold text-[10px] uppercase tracking-wider pb-2 border-b border-[#e2e8f0]">
              <Folder className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Working Directory</span>
            </div>
            
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
              {workingDirectory.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#94a3b8] font-mono italic">
                  No files exist
                </div>
              ) : (
                workingDirectory.map((file, i) => {
                  let badgeColor = 'bg-rose-50 text-rose-600 border-rose-200';
                  let statusLabel = 'Untracked';
                  if (file.status === 'modified') {
                    badgeColor = 'bg-amber-50 text-amber-600 border-amber-200';
                    statusLabel = 'Modified';
                  } else if (file.status === 'staged') {
                    badgeColor = 'bg-purple-50 text-purple-600 border-purple-200';
                    statusLabel = 'Staged';
                  } else if (file.status === 'committed') {
                    badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200';
                    statusLabel = 'Committed';
                  }

                  return (
                    <motion.div 
                      key={file.name}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-lg bg-[#ffffff] border border-[#e2e8f0] shadow-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className={`w-3.5 h-3.5 ${file.status === 'untracked' ? 'text-rose-500' : 'text-[#64748b]'}`} />
                        <div>
                          <div className="text-xs font-mono font-bold text-[#0f172a]">{file.name}</div>
                          <div className="text-[10px] text-[#64748b] italic max-w-[125px] truncate">{file.content}</div>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {statusLabel}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>
            <div className="text-[9px] text-[#64748b] leading-relaxed mt-2 font-mono bg-[#ffffff] p-2 rounded-lg border border-[#e2e8f0]">
              <span className="font-bold text-[#0f172a] block mb-0.5">Legend:</span>
              <span className="text-rose-600 font-semibold">● Untracked</span> | <span className="text-amber-600 font-semibold">● Modified</span> | <span className="text-purple-600 font-semibold">● Staged</span> | <span className="text-emerald-600 font-semibold">● Committed</span>
            </div>
          </div>

          {/* Column 2: Staging Area */}
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] flex flex-col gap-3 min-h-[220px] relative">
            <div className="flex items-center gap-1.5 text-[#0f172a] font-bold text-[10px] uppercase tracking-wider pb-2 border-b border-[#e2e8f0]">
              <Inbox className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>Staging Area (Index)</span>
            </div>
            
            <div className="flex flex-col gap-2 flex-1 justify-center">
              {stagedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-[#94a3b8] text-xs">
                  <Inbox className="w-7 h-7 text-[#cbd5e1] mb-1.5" />
                  <p className="font-mono italic text-[#64748b]">Staging index is empty</p>
                  <p className="text-[10px] mt-1.5 max-w-[160px] text-[#64748b] leading-relaxed">
                    Use <strong className="text-[#0f172a] font-bold">git add &lt;file&gt;</strong> to package files for a snapshot.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-[9px] font-mono text-[#15803d] font-bold mb-1 text-center bg-[#f0fdf4] py-1 rounded-lg border border-[#bbf7d0]">
                    📦 READY TO COMMIT
                  </div>
                  {stagedFiles.map((file) => (
                    <motion.div 
                      key={file.name}
                      layoutId={`stage-${file.name}`}
                      className="p-2 rounded-lg bg-[#ffffff] border border-[#ddd6fe] shadow-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#7c3aed]" />
                        <span className="text-xs font-mono font-bold text-[#7c3aed]">{file.name}</span>
                      </div>
                      <span className="text-[9px] font-bold font-mono text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 rounded-full border border-[#ede9fe]">Staged</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#ffffff] border border-[#e2e8f0] p-1.5 rounded-full shadow-sm">
              <ArrowRight className="w-3.5 h-3.5 text-[#7c3aed]" />
            </div>
          </div>

          {/* Column 3: Local Vault & Commits */}
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] flex flex-col gap-3 min-h-[220px]">
            <div className="flex items-center gap-1.5 text-[#0f172a] font-bold text-[10px] uppercase tracking-wider pb-2 border-b border-[#e2e8f0]">
              <Shield className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Local Repo (Commits)</span>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {commits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-[#94a3b8] text-xs">
                  <Database className="w-7 h-7 text-[#cbd5e1] mb-1.5" />
                  <p className="font-mono italic text-[#64748b]">No commits yet</p>
                  <p className="text-[10px] mt-1.5 max-w-[160px] text-[#64748b] leading-relaxed">
                    Ready files inside the staging area, then type <strong className="text-[#0f172a] font-bold">git commit</strong> to seal the vault.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 border-l-2 border-[#e2e8f0] pl-4 ml-2.5 my-2 relative">
                  {commits.map((c, idx) => (
                    <div key={c.id} className="relative group">
                      {/* Node point */}
                      <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#7c3aed] border-2 border-white shadow-xs group-hover:scale-125 transition-transform" />
                      
                      <div className="p-2.5 rounded-lg bg-[#ffffff] border border-[#e2e8f0] hover:border-[#ddd6fe] shadow-xs transition-colors flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#7c3aed] font-bold">{c.id}</span>
                          <span className="text-[#64748b]">branch: {c.branch}</span>
                        </div>
                        <div className="text-xs text-[#0f172a] font-semibold font-sans leading-tight">
                          {c.message}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.keys(c.files).map(fn => (
                            <span key={fn} className="text-[9px] font-mono bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] px-1.5 py-0.5 rounded">
                              {fn}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
