import { useState } from 'react';
import { UserProgress, Badge, UserProfile } from '../types';
import { ALL_BADGES } from '../data/lessons';
import { 
  Trophy, Award, Calendar, Share2, Mail, Download, CheckCircle, Star, 
  Sparkles, Printer, User, Terminal, Code, ShieldCheck, Cpu, Rocket, Save, Settings,
  AlertTriangle, RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileProps {
  progress: UserProgress;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onResetProgress?: () => void;
}

const AVAILABLE_ICONS = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'code', label: 'Code Dev', icon: Code },
  { id: 'shield', label: 'Shield', icon: ShieldCheck },
  { id: 'cpu', label: 'Core CPU', icon: Cpu },
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'rocket', label: 'Rocket', icon: Rocket },
  { id: 'user', label: 'Cadet Profile', icon: User },
];

const AVAILABLE_COLORS = [
  { id: 'purple', label: 'Neon Purple', class: 'bg-[#f5f3ff] border-[#ddd6fe] text-[#7c3aed] hover:bg-[#ede9fe]' },
  { id: 'blue', label: 'Cosmic Blue', class: 'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb] hover:bg-[#dbeafe]' },
  { id: 'green', label: 'Git Green', class: 'bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a] hover:bg-[#dcfce7]' },
  { id: 'amber', label: 'XP Amber', class: 'bg-[#fffbeb] border-[#fef3c7] text-[#d97706] hover:bg-[#fef3c7]' },
  { id: 'rose', label: 'Cherry Red', class: 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626] hover:bg-[#fee2e2]' },
  { id: 'teal', label: 'Ocean Teal', class: 'bg-[#f0fdfa] border-[#99f6e4] text-[#0d9488] hover:bg-[#ccfbf1]' },
];

function getAvatarIcon(iconName: string) {
  switch (iconName) {
    case 'terminal': return Terminal;
    case 'code': return Code;
    case 'shield': return ShieldCheck;
    case 'cpu': return Cpu;
    case 'sparkles': return Sparkles;
    case 'rocket': return Rocket;
    default: return User;
  }
}

function getAvatarColorClasses(colorName: string) {
  switch (colorName) {
    case 'green': return 'bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a]';
    case 'amber': return 'bg-[#fffbeb] border-[#fef3c7] text-[#d97706]';
    case 'rose': return 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]';
    case 'purple': return 'bg-[#f5f3ff] border-[#ddd6fe] text-[#7c3aed]';
    case 'teal': return 'bg-[#f0fdfa] border-[#99f6e4] text-[#0d9488]';
    default: return 'bg-[#f5f3ff] border-[#ddd6fe] text-[#7c3aed]';
  }
}

export default function Profile({ progress, profile, onSaveProfile, onResetProgress }: ProfileProps) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  const completedCount = progress.completedLessons.length;
  const isEligibleForCertificate = completedCount >= 5;

  // Calculate stats
  const currentLevel = Math.floor(progress.xp / 300) + 1;
  const xpNeededForNext = currentLevel * 300;
  const previousLevelXp = (currentLevel - 1) * 300;
  const xpProgressPercent = Math.min(
    100,
    Math.max(0, ((progress.xp - previousLevelXp) / (xpNeededForNext - previousLevelXp)) * 100)
  );

  const handlePrint = () => {
    window.print();
  };

  const handleProfileUpdate = (fields: Partial<UserProfile>) => {
    onSaveProfile({
      ...profile,
      ...fields
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6" id="profile-view">
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Main Identity Card */}
        <div className="lg:col-span-1 bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-sm">
          <div className="relative">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border shadow-sm relative ${getAvatarColorClasses(profile.avatarColor)}`}>
              {(() => {
                const IconComp = getAvatarIcon(profile.avatarIcon);
                return <IconComp className="w-10 h-10" />;
              })()}
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#f59e0b] text-white flex items-center justify-center border-2 border-white font-extrabold text-xs font-mono shadow-xs">
                {currentLevel}
              </span>
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-lg font-extrabold text-[#0f172a] font-sans truncate">{profile.name}</h2>
            <div className="text-xs text-[#7c3aed] font-bold font-mono mt-0.5">{profile.role}</div>
            
            <p className="text-[11px] text-[#64748b] italic mt-2.5 max-w-xs mx-auto px-4 leading-normal bg-[#f8fafc] py-2 rounded-xl border border-[#e2e8f0]">
              "{profile.bio}"
            </p>

            <div className="text-[10px] text-[#64748b] mt-3 flex items-center justify-center gap-1.5 font-mono">
              <Mail className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span className="truncate max-w-[180px]">{profile.email}</span>
            </div>
          </div>

          {/* XP detail lines */}
          <div className="w-full mt-2 pt-4 border-t border-[#e2e8f0]">
            <div className="flex items-center justify-between font-bold font-mono text-[9px] text-[#64748b] uppercase tracking-wider mb-1.5">
              <span>Level Progress</span>
              <span className="text-[#7c3aed]">{progress.xp} Total XP</span>
            </div>
            <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden border border-[#e2e8f0]">
              <div 
                className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7]"
                style={{ width: `${xpProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Profile Settings and Customizer */}
        <div className="lg:col-span-2 bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <h3 className="font-bold text-[#0f172a] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-[#7c3aed]" /> PROFILE SETTINGS & AVATAR
              </h3>
              {saveToast && (
                <span className="text-[9px] font-mono text-[#15803d] bg-[#f0fdf4] px-2.5 py-0.5 rounded-full border border-[#bbf7d0] animate-pulse font-bold">
                  ✓ Profile Saved!
                </span>
              )}
            </div>

            {/* Editing Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#64748b] mb-1 font-mono">Graduation Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => handleProfileUpdate({ name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#64748b] mb-1 font-mono">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => handleProfileUpdate({ email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#64748b] mb-1 font-mono">Academy Role Title</label>
                <input 
                  type="text" 
                  value={profile.role}
                  onChange={(e) => handleProfileUpdate({ role: e.target.value })}
                  placeholder="e.g. Branch Master"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#64748b] mb-1 font-mono">Motto / Status Bio</label>
                <input 
                  type="text" 
                  value={profile.bio}
                  onChange={(e) => handleProfileUpdate({ bio: e.target.value })}
                  placeholder="e.g. Ready to commit!"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
            </div>

            {/* Custom Avatar Selectors */}
            <div className="mt-2 flex flex-col gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#64748b] mb-1.5 font-mono">Choose Avatar Icon</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = profile.avatarIcon === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleProfileUpdate({ avatarIcon: item.id })}
                        title={item.label}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                          isSelected
                            ? 'bg-[#f5f3ff] border-[#7c3aed] text-[#7c3aed]'
                            : 'bg-[#f8fafc] border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a]'
                        }`}
                      >
                        <IconComp className="w-4.5 h-4.5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#64748b] mb-1.5 font-mono">Choose Avatar Theme Color</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map((col) => {
                    const isSelected = profile.avatarColor === col.id;
                    return (
                      <button
                        key={col.id}
                        onClick={() => handleProfileUpdate({ avatarColor: col.id })}
                        title={col.label}
                        className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-xl border transition-all cursor-pointer ${col.class} ${
                          isSelected ? 'scale-105 ring-2 ring-[#7c3aed]/40' : 'opacity-80'
                        }`}
                      >
                        {col.label.split(' ')[1]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-[#64748b] max-w-sm leading-relaxed">
              Solve terminal challenges to unlock and claim your print-ready certificate of Git Mastery once you complete at least 5 core curriculum modules.
            </p>
            <button
              disabled={!isEligibleForCertificate}
              onClick={() => setShowCertificate(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#f1f5f9] disabled:text-[#94a3b8] disabled:border-[#e2e8f0] disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Claim Completion Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Badges Trophy cabinet detail row */}
      <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-[#0f172a] text-xs uppercase tracking-wider border-b border-[#e2e8f0] pb-3 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#f59e0b]" /> TROPHY CABINET ACHIEVEMENTS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  isUnlocked
                    ? 'bg-[#f5f3ff] border-[#ede9fe] text-[#0f172a]'
                    : 'bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                  isUnlocked ? 'bg-[#fffbeb] border-[#fef3c7] text-[#d97706]' : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#cbd5e1]'
                }`}>
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isUnlocked ? 'text-[#0f172a]' : 'text-[#94a3b8]'}`}>
                    {badge.title}
                  </div>
                  <div className="text-[10px] text-[#64748b] leading-normal mt-0.5">
                    {badge.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Reset Progress & Data */}
      {onResetProgress && (
        <div className="bg-[#ffffff] border border-rose-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#dc2626] text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-4 h-4 text-[#dc2626]" /> DANGER ZONE • RESET LEARNING DATA
              </h3>
              <p className="text-xs text-[#64748b] mt-1 max-w-xl leading-relaxed">
                Want a fresh start? Resetting will clear all unlocked roadmap lessons, XP balance ({progress.xp} XP), daily streak ({progress.streak}d), and trophy badges.
              </p>
            </div>
            <button
              type="button"
              id="profile-reset-progress-btn"
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-[#dc2626] text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-2 font-mono shrink-0 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Program Data</span>
            </button>
          </div>
        </div>
      )}

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
                <li>All completed lessons and roadmap unlocked stages</li>
                <li>Your total XP ({progress.xp} XP) and level score</li>
                <li>Earned coins ({progress.coins} Coins) and streak ({progress.streak}d)</li>
                <li>All unlocked badges in your achievement showcase</li>
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
                id="profile-confirm-reset-btn"
                onClick={() => {
                  if (onResetProgress) {
                    onResetProgress();
                  }
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

      {/* Reset Success Toast */}
      {resetSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#15803d] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-mono animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>Progress data successfully reset!</span>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:p-0 overflow-y-auto backdrop-blur-xs">
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-6 max-w-4xl w-full flex flex-col gap-6 print:border-none print:bg-white print:text-black shadow-2xl">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4 print:hidden">
              <div className="flex items-center gap-1.5 text-[#0f172a]">
                <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                <span className="font-bold text-xs uppercase tracking-wider">Cadet graduation credential</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shadow-purple-500/20"
                >
                  <Printer className="w-4 h-4" /> Print Certificate
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] font-bold text-xs rounded-xl cursor-pointer border border-[#e2e8f0]"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Certificate Canvas Sheet */}
            <div className="bg-[#fafaf9] border-8 border-[#e2e8f0] rounded-2xl p-10 md:p-16 text-center relative flex flex-col items-center justify-center gap-6 print:border-[#e2e8f0] print:bg-white print:text-slate-900">
              {/* Elegant frame lines */}
              <div className="absolute inset-2 border border-[#e2e8f0] rounded-xl pointer-events-none"></div>

              <div className="flex flex-col items-center gap-3">
                <Award className="w-14 h-14 text-[#f59e0b] mb-2 fill-[#f59e0b]/10" />
                <h1 className="text-2xl font-black font-serif tracking-tight text-[#0f172a] print:text-slate-900">
                  Certificate of Achievement
                </h1>
                <div className="h-0.5 w-20 bg-[#7c3aed] my-1"></div>
                <p className="text-[10px] uppercase tracking-widest font-mono text-[#7c3aed] font-bold">
                  GIT & GITHUB ACADEMY
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <p className="text-xs text-[#64748b] italic">This credential certifies that</p>
                <h2 className="text-xl font-extrabold text-[#0f172a] tracking-wide font-sans underline decoration-[#7c3aed] decoration-wavy underline-offset-8 py-2 print:text-slate-900">
                  {profile.name}
                </h2>
                <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed mt-2">
                  has successfully completed the complete training curriculum, mastering local initialization, file staging, repositories, branch switches, merges, and remote interactions.
                </p>
              </div>

              {/* Signature row */}
              <div className="grid grid-cols-2 gap-12 mt-8 w-full max-w-lg border-t border-[#e2e8f0] pt-6">
                <div>
                  <div className="font-serif italic text-sm text-[#0f172a] print:text-slate-900 font-bold">Turing</div>
                  <div className="text-[10px] text-[#64748b] font-mono mt-1">Git AI Mentor Sign-off</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-[#0f172a] print:text-slate-900 font-bold">
                    {new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-[10px] text-[#64748b] font-mono mt-1">Completion Date</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
