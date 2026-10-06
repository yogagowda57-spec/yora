import { useState } from 'react';
import { UserProgress, Module, Lesson } from '../types';
import { MODULES, ALL_BADGES } from '../data/lessons';
import { Trophy, Flame, Coins, Zap, Star, ShieldCheck, Lock, CheckCircle, ChevronRight, HelpCircle, AlertTriangle, RotateCcw } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  onResetProgress: () => void;
}

export default function Dashboard({ progress, onSelectLesson, onResetProgress }: DashboardProps) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  // Get next active lesson (first uncompleted lesson)
  const getNextLesson = (): { lesson: Lesson; module: Module } | null => {
    for (const mod of MODULES) {
      for (const les of mod.lessons) {
        if (!progress.completedLessons.includes(les.id)) {
          return { lesson: les, module: mod };
        }
      }
    }
    // All completed
    if (MODULES.length > 0 && MODULES[0].lessons.length > 0) {
      return { lesson: MODULES[0].lessons[0], module: MODULES[0] };
    }
    return null;
  };

  const nextActive = getNextLesson();

  // Simple Level Formula: Level = Floor(XP / 300) + 1
  const currentLevel = Math.floor(progress.xp / 300) + 1;
  const xpNeededForNext = currentLevel * 300;
  const previousLevelXp = (currentLevel - 1) * 300;
  const xpProgressPercent = Math.min(
    100,
    Math.max(0, ((progress.xp - previousLevelXp) / (xpNeededForNext - previousLevelXp)) * 100)
  );

  // Missions Mock Database
  const missions = [
    { id: 'm1', title: 'Daily Explorer', desc: 'Complete 1 Git Lesson today', target: 1, current: progress.completedLessons.length > 0 ? 1 : 0, reward: 50, type: 'lessons' },
    { id: 'm2', title: 'XP Collector', desc: 'Accumulate 250 XP', target: 250, current: Math.min(250, progress.xp), reward: 80, type: 'xp' },
    { id: 'm3', title: 'Commit Maestro', desc: 'Solve a history or branch challenge', target: 1, current: progress.completedLessons.filter(id => id.includes('commit') || id.includes('branch')).length > 0 ? 1 : 0, reward: 100, type: 'sandbox' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="dashboard-view">
      {/* Left Column: Progress Roadmap Tree */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#180b2b] via-[#24124d] to-[#1a0b36] rounded-2xl p-6 border border-[#3b1d6e] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="absolute right-0 top-0 w-48 h-48 bg-[#a855f7]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex-1 relative z-10">
            <span className="text-[10px] font-mono font-bold text-[#c084fc] uppercase tracking-wider bg-[#581c87]/50 border border-[#7e22ce]/60 px-3 py-1 rounded-full">
              CADET STATUS ACTIVE
            </span>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-3">
              Welcome back, Cadet! <Star className="w-4.5 h-4.5 text-[#f59e0b] fill-[#f59e0b]" />
            </h2>
            <p className="text-[#cbd5e1] text-xs mt-1.5 max-w-md leading-relaxed">
              Step onto the bridge. Your journey to mastering distributed version control starts here. Run commands, unlock branches, and earn credentials.
            </p>
            {nextActive && (
              <button
                onClick={() => onSelectLesson(nextActive.lesson)}
                className="mt-4 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Resume Lesson: {nextActive.lesson.title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Stats Block */}
          <div className="bg-[#0f0721]/80 p-5 rounded-xl border border-[#3b1d6e]/60 shrink-0 w-full md:w-64 backdrop-blur-xs relative z-10">
            <div className="flex items-center justify-between font-mono font-semibold text-xs text-[#94a3b8]">
              <span>LEVEL {currentLevel}</span>
              <span className="text-[#c084fc] font-bold">{progress.xp} / {xpNeededForNext} XP</span>
            </div>
            {/* XP progress bar */}
            <div className="w-full h-2.5 bg-[#1c0e38] rounded-full mt-2.5 overflow-hidden border border-[#3b1d6e]/60">
              <div 
                className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] rounded-full transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-2 font-mono text-right">
              {xpNeededForNext - progress.xp} XP to next milestone
            </div>
          </div>
        </div>

        {/* Modules Roadmap Node Tree */}
        <div className="flex flex-col gap-6">
          {MODULES.map((module, mIdx) => {
            const moduleCompletedLessons = module.lessons.filter(les => progress.completedLessons.includes(les.id));
            const modulePercent = module.lessons.length > 0
              ? Math.round((moduleCompletedLessons.length / module.lessons.length) * 100)
              : 0;

            return (
              <div key={module.id} className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-6">
                {/* Module Heading */}
                <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[#7c3aed] uppercase tracking-wider">
                      MODULE 0{mIdx + 1}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                      {module.title}
                    </h3>
                    <p className="text-xs text-[#64748b] mt-0.5">{module.description}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#7c3aed] bg-[#f5f3ff] border border-[#ddd6fe] px-3 py-1 rounded-full">
                    {modulePercent}% Complete
                  </span>
                </div>

                {/* Vertical roadmap layout (alternating node alignment) */}
                <div className="flex flex-col items-center gap-6 py-6 relative">
                  {/* Tree trunk connecting line */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#e2e8f0] z-0"></div>

                  {module.lessons.map((lesson, lIdx) => {
                    const isCompleted = progress.completedLessons.includes(lesson.id);
                    // A lesson is active (unlocked) if it is completed, OR if the preceding lesson in the module was completed.
                    let isUnlocked = false;
                    if (lIdx === 0) {
                      if (mIdx === 0) {
                        isUnlocked = true;
                      } else {
                        // Unlocked if previous module is done
                        const prevModule = MODULES[mIdx - 1];
                        isUnlocked = prevModule.lessons.every(l => progress.completedLessons.includes(l.id));
                      }
                    } else {
                      isUnlocked = progress.completedLessons.includes(module.lessons[lIdx - 1].id);
                    }

                    // Alternating alignment offset for node map look
                    const alignClass = lIdx % 2 === 0 ? 'md:translate-x-16' : 'md:-translate-x-16';

                    return (
                      <div 
                        key={lesson.id} 
                        className={`z-10 flex flex-col items-center gap-2 max-w-xs transition-transform hover:scale-105 ${alignClass}`}
                      >
                        {/* Node Round Button */}
                        <button
                          onClick={() => isUnlocked && onSelectLesson(lesson)}
                          disabled={!isUnlocked}
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-md cursor-pointer relative transition-all active:scale-95 ${
                            isCompleted
                              ? 'bg-[#16a34a] border-[#22c55e] text-white hover:bg-[#15803d]'
                              : isUnlocked
                                ? 'bg-[#7c3aed] border-[#a78bfa] text-white hover:bg-[#6d28d9] shadow-purple-500/30 animate-pulse'
                                : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 fill-white text-[#16a34a]" />
                          ) : isUnlocked ? (
                            <Star className="w-4 h-4 fill-white text-[#7c3aed]" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          
                          {/* Small reward badge tag */}
                          {isUnlocked && !isCompleted && (
                            <span className="absolute -top-1 -right-2 px-1.5 py-0.5 bg-[#f59e0b] border border-amber-200 text-white font-mono text-[8px] font-bold rounded-full shadow-xs">
                              +{lesson.xpReward}XP
                            </span>
                          )}
                        </button>

                        {/* Node Details Text */}
                        <div className="text-center">
                          <div className={`text-xs font-bold leading-tight ${isUnlocked ? 'text-[#0f172a]' : 'text-[#94a3b8]'}`}>
                            {lesson.title}
                          </div>
                          <div className="text-[10px] text-[#64748b] max-w-[150px] truncate mx-auto mt-0.5">
                            {lesson.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Gamification Widgets / Sidebar */}
      <div className="flex flex-col gap-6">
        {/* Quick Stats Panel */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-[#0f172a] text-xs uppercase tracking-wider border-b border-[#e2e8f0] pb-3 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#f59e0b]" /> YOUR ACADEMY BALANCE
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
              <Zap className="w-4.5 h-4.5 text-[#7c3aed] mb-1" />
              <div className="font-extrabold font-mono text-sm text-[#0f172a]">{progress.xp}</div>
              <div className="text-[8px] text-[#64748b] font-semibold uppercase tracking-wider">XP</div>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
              <Coins className="w-4.5 h-4.5 text-[#f59e0b] mb-1" />
              <div className="font-extrabold font-mono text-sm text-[#0f172a]">{progress.coins}</div>
              <div className="text-[8px] text-[#64748b] font-semibold uppercase tracking-wider">Coins</div>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
              <Flame className="w-4.5 h-4.5 text-[#ea580c] mb-1" />
              <div className="font-extrabold font-mono text-sm text-[#0f172a]">{progress.streak}d</div>
              <div className="text-[8px] text-[#64748b] font-semibold uppercase tracking-wider">Streak</div>
            </div>
          </div>
        </div>

        {/* Daily Missions Widget */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-[#0f172a] text-xs uppercase tracking-wider border-b border-[#e2e8f0] pb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#7c3aed]" /> ACTIVE MISSIONS
          </h3>
          <div className="flex flex-col gap-3">
            {missions.map((m) => {
              const percent = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <div key={m.id} className="bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2e8f0] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">{m.title}</div>
                      <div className="text-[10px] text-[#64748b] mt-0.5">{m.desc}</div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 rounded-md border border-[#ede9fe]">
                      +{m.reward} XP
                    </span>
                  </div>
                  {/* Progress Line */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#7c3aed] rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-mono text-[#64748b] font-bold shrink-0">
                      {m.current}/{m.target}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlocked Badges Trophy Cabinet */}
        <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-[#0f172a] text-xs uppercase tracking-wider border-b border-[#e2e8f0] pb-3 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#f59e0b]" /> TROPHY CABINET
          </h3>
          
          <div className="grid grid-cols-4 gap-2.5">
            {ALL_BADGES.map((badge) => {
              const isUnlocked = progress.unlockedBadges.includes(badge.id);
              return (
                <div 
                  key={badge.id}
                  title={`${badge.title}: ${badge.description}`}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all hover:scale-105 ${
                    isUnlocked
                      ? 'bg-[#f5f3ff] border-[#ddd6fe] text-[#7c3aed] shadow-xs'
                      : 'bg-[#f8fafc] border-[#e2e8f0] text-[#cbd5e1]'
                  }`}
                >
                  <Trophy className={`w-4 h-4 ${isUnlocked ? 'fill-[#7c3aed]/20 text-[#7c3aed]' : ''}`} />
                  <div className={`text-[8px] mt-1 font-bold font-sans text-center truncate max-w-full ${isUnlocked ? 'text-[#0f172a]' : 'text-[#94a3b8]'}`}>
                    {badge.title.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-[#64748b] text-center font-medium italic mt-1">
            Solve terminal lesson challenges to unlock rare badges!
          </p>
        </div>

        {/* Safety Reset button */}
        <div className="text-center mt-2">
          <button 
            id="reset-progress-btn"
            onClick={() => setShowResetModal(true)}
            className="text-[11px] text-[#ef4444] hover:text-[#dc2626] font-semibold hover:underline cursor-pointer font-mono flex items-center justify-center gap-1.5 mx-auto py-1 px-3 rounded-lg hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Progress */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in select-none">
          <div className="bg-[#ffffff] border border-[#e2e8f0] max-w-md w-full p-6 rounded-2xl shadow-2xl flex flex-col gap-4 relative">
            <div className="flex items-center gap-3 border-b border-[#e2e8f0] pb-3 text-[#dc2626]">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#dc2626]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#0f172a]">Reset All Progress Data?</h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="text-xs text-[#475569] leading-relaxed bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2e8f0]">
              <p className="font-semibold text-[#0f172a] mb-1.5">Resetting will permanently wipe:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#64748b]">
                <li>All unlocked module lessons and curriculum roadmap steps</li>
                <li>Your total XP ({progress.xp} XP) and Academy Level</li>
                <li>Earned coins ({progress.coins} Coins) and daily streak count ({progress.streak}d)</li>
                <li>All {progress.unlockedBadges.length} earned trophies in your achievement cabinet</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] font-bold text-xs rounded-xl cursor-pointer transition-colors border border-[#e2e8f0]"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-reset-progress-btn"
                onClick={() => {
                  onResetProgress();
                  setShowResetModal(false);
                  setResetSuccessToast(true);
                  setTimeout(() => setResetSuccessToast(false), 3000);
                }}
                className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yes, Reset Progress</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {resetSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#15803d] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-mono animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>Progress data successfully reset!</span>
        </div>
      )}
    </div>
  );
}
