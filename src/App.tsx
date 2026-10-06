import { useState, useEffect } from 'react';
import { UserProgress, Lesson, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import Sandbox from './components/Sandbox';
import Cheatsheet from './components/Cheatsheet';
import Profile from './components/Profile';
import AboutWeb from './components/AboutWeb';
import { MODULES } from './data/lessons';
import { 
  BookOpen, Terminal, FileText, Trophy, Settings, Sparkles, Flame, Coins, Zap, Star, Menu, X, RotateCcw,
  User, Code, ShieldCheck, Cpu, Rocket, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOCAL_STORAGE_KEY = 'git_academy_progress_data';
const PROFILE_LOCAL_STORAGE_KEY = 'git_academy_profile_data';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Git Academy Cadet',
  email: 'yogagowda57@gmail.com',
  role: 'Git Apprentice',
  bio: 'Ready to write some history! 🚀',
  avatarIcon: 'terminal',
  avatarColor: 'blue'
};

export function getAvatarIcon(iconName: string) {
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

export function getAvatarColorClasses(colorName: string) {
  switch (colorName) {
    case 'green': return 'bg-emerald-50 border-emerald-200 text-emerald-600';
    case 'amber': return 'bg-amber-50 border-amber-200 text-amber-600';
    case 'rose': return 'bg-rose-50 border-rose-200 text-rose-600';
    case 'purple': return 'bg-purple-50 border-purple-200 text-purple-600';
    case 'teal': return 'bg-teal-50 border-teal-200 text-teal-600';
    default: return 'bg-indigo-50 border-indigo-200 text-indigo-600';
  }
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  coins: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  completedLessons: [],
  unlockedBadges: [],
  notes: {},
  bookmarks: [],
  completedMissions: []
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'sandbox' | 'cheatsheet' | 'profile' | 'about'>('roadmap');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unlockedBadgeNotification, setUnlockedBadgeNotification] = useState<string | null>(null);

  const activeModule = activeLesson ? MODULES.find(m => m.id === activeLesson.moduleId) : null;

  // Load progress and profile on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: UserProgress = JSON.parse(saved);
        
        // Calculate streak decay on load
        if (parsed.lastActiveDate) {
          const todayStr = new Date().toDateString();
          const d1 = new Date(parsed.lastActiveDate);
          const d2 = new Date(todayStr);
          d1.setHours(0, 0, 0, 0);
          d2.setHours(0, 0, 0, 0);
          const diffTime = d2.getTime() - d1.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 1) {
            // Streak broken! Reset to 0
            parsed.streak = 0;
          }
        } else {
          parsed.streak = 0;
        }

        setProgress(parsed);
      } catch (err) {
        console.error('Failed to parse progress data:', err);
      }
    }

    const savedProfile = localStorage.getItem(PROFILE_LOCAL_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
      } catch (err) {
        console.error('Failed to parse profile data:', err);
      }
    }
  }, []);

  // Sync progress back to localstorage
  const saveProgress = (updated: UserProgress) => {
    setProgress(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const saveProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem(PROFILE_LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleLessonCompleted = (lessonId: string, xpReward: number, coinReward: number, unlockedBadgeId?: string) => {
    const completed = [...new Set([...progress.completedLessons, lessonId])];
    const unlockedBadges = [...progress.unlockedBadges];
    
    if (unlockedBadgeId && !unlockedBadges.includes(unlockedBadgeId)) {
      unlockedBadges.push(unlockedBadgeId);
      // Trigger temporary animated overlay notification
      setUnlockedBadgeNotification(unlockedBadgeId);
    }

    // Streak calculation upon completion
    const todayStr = new Date().toDateString();
    let newStreak = progress.streak;

    if (!progress.lastActiveDate) {
      newStreak = 1;
    } else {
      const d1 = new Date(progress.lastActiveDate);
      const d2 = new Date(todayStr);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Active yesterday, increment streak
        newStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken, reset and start fresh at 1
        newStreak = 1;
      } else if (diffDays === 0) {
        // Already active today, streak stays the same (no double-incrementing on the same day)
        if (newStreak === 0) {
          newStreak = 1;
        }
      }
    }

    const updatedProgress: UserProgress = {
      ...progress,
      completedLessons: completed,
      xp: progress.xp + xpReward,
      coins: progress.coins + coinReward,
      unlockedBadges,
      streak: newStreak,
      lastActiveDate: todayStr
    };

    saveProgress(updatedProgress);
    setActiveLesson(null); // Return back to dashboard roadmap
  };

  const handleResetProgress = () => {
    const freshProgress: UserProgress = {
      xp: 0,
      coins: 0,
      level: 1,
      streak: 0,
      lastActiveDate: '',
      completedLessons: [],
      unlockedBadges: [],
      notes: {},
      bookmarks: [],
      completedMissions: []
    };
    saveProgress(freshProgress);
    localStorage.removeItem('git_stash_temp');
    setActiveLesson(null);
    setActiveTab('roadmap');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] flex font-sans select-none overflow-x-hidden antialiased" id="git-academy-root">
      
      {/* Drawer Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
        ></div>
      )}

      {/* Sidebar Navigation Panel */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#ffffff] border-r border-[#e2e8f0] z-40 transform lg:transform-none transition-transform duration-300 flex flex-col justify-between ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#e2e8f0] bg-[#ffffff]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#6366f1] rounded-lg flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                <Terminal className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-[#0f172a] font-sans leading-none">
                  Git<strong className="text-[#7c3aed]">Master</strong>
                </span>
                <span className="text-[9px] text-[#8b5cf6] font-mono font-semibold tracking-wider mt-1 leading-none">
                  audinex_tech
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#64748b] hover:text-[#0f172a]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation link group list */}
          <nav className="p-4 flex flex-col gap-1.5">
            <button
              onClick={() => { setActiveTab('roadmap'); setActiveLesson(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'roadmap' && !activeLesson
                  ? 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Interactive Roadmap</span>
            </button>

            <button
              onClick={() => { setActiveTab('sandbox'); setActiveLesson(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>Sandbox Arena</span>
            </button>

            <button
              onClick={() => { setActiveTab('cheatsheet'); setActiveLesson(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cheatsheet'
                  ? 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Interactive Cheatsheet</span>
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setActiveLesson(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span>Trophy cabinet</span>
            </button>

            <button
              onClick={() => { setActiveTab('about'); setActiveLesson(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>About Web</span>
            </button>
          </nav>
        </div>

        {/* User simple status badge */}
        <div className="p-4 border-t border-[#e2e8f0] bg-[#ffffff]">
          <button 
            onClick={() => { setActiveTab('profile'); setActiveLesson(null); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors p-3 rounded-xl border border-[#e2e8f0] text-left cursor-pointer group"
          >
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all group-hover:scale-105 ${getAvatarColorClasses(profile.avatarColor)}`}>
              {(() => {
                const IconComponent = getAvatarIcon(profile.avatarIcon);
                return <IconComponent className="w-4 h-4" />;
              })()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#0f172a] truncate">{profile.name}</div>
              <div className="text-[9px] text-[#64748b] mt-0.5 truncate">{profile.role}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        
        {/* Global Toolbar Header */}
        <header className="h-16 border-b border-[#e2e8f0] bg-[#ffffff]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[#f1f5f9] rounded-lg text-[#64748b] hover:text-[#0f172a] cursor-pointer mr-2 border border-transparent hover:border-[#e2e8f0]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {activeLesson && activeModule && (
              <div className="hidden md:flex items-center gap-2 text-xs text-[#64748b] font-sans ml-2 border-l border-[#e2e8f0] pl-4">
                <span>{activeModule.title}</span>
                <span className="text-[#cbd5e1]">/</span>
                <span className="text-[#0f172a] font-bold">{activeLesson.title}</span>
              </div>
            )}

            {!activeLesson && (
              <div className="hidden md:flex items-center gap-2 text-xs text-[#64748b] font-sans ml-2 border-l border-[#e2e8f0] pl-4">
                <span className="text-[#0f172a] font-bold capitalize">
                  {activeTab === 'roadmap' ? 'Learning Roadmap' : activeTab === 'sandbox' ? 'Sandbox Arena' : activeTab === 'cheatsheet' ? 'Command Cheatsheet' : 'Trophy cabinet'}
                </span>
              </div>
            )}
          </div>

          {/* User Score Stats indicators */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto font-mono text-[10px] sm:text-xs font-bold shrink-0">
            <div className="flex items-center gap-1.5 text-[#7c3aed] bg-[#f5f3ff] px-3 py-1.5 rounded-lg border border-[#ede9fe]" title="Total XP">
              <Zap className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>{progress.xp} <span className="hidden sm:inline">XP</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#b45309] bg-[#fffbeb] px-3 py-1.5 rounded-lg border border-[#fef3c7]" title="Total Coins">
              <Coins className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>{progress.coins}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#c2410c] bg-[#fff7ed] px-3 py-1.5 rounded-lg border border-[#ffedd5]" title="Current Streak">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ea580c] fill-[#ea580c]" />
              <span>{progress.streak}<span className="hidden sm:inline"> Day Streak</span><span className="sm:hidden">d</span></span>
            </div>
          </div>
        </header>

        {/* Dynamic Screen View routing panel */}
        <div className="flex-1 p-6 md:p-8 select-text bg-[#f8fafc]">
          <AnimatePresence mode="wait">
            {activeLesson ? (
              <LessonView
                key={`lesson-${activeLesson.id}`}
                lesson={activeLesson}
                progress={progress}
                onLessonCompleted={handleLessonCompleted}
                onBackToDashboard={() => setActiveLesson(null)}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === 'roadmap' && (
                  <Dashboard
                    progress={progress}
                    onSelectLesson={(lesson) => setActiveLesson(lesson)}
                    onResetProgress={handleResetProgress}
                  />
                )}
                {activeTab === 'sandbox' && <Sandbox />}
                {activeTab === 'cheatsheet' && <Cheatsheet />}
                {activeTab === 'profile' && (
                  <Profile 
                    progress={progress} 
                    profile={profile}
                    onSaveProfile={saveProfile}
                    onResetProgress={handleResetProgress}
                  />
                )}
                {activeTab === 'about' && <AboutWeb />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Temporary Unlocked Badge celebration dialog */}
      {unlockedBadgeNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in select-none">
          <div className="bg-[#ffffff] border border-[#ddd6fe] max-w-sm w-full p-6 rounded-2xl text-center shadow-2xl flex flex-col items-center gap-4 relative">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#7c3aed] to-[#6366f1] rounded-t-2xl"></div>
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center text-xl shadow-inner animate-bounce mt-2">
              <Trophy className="w-8 h-8 fill-amber-500/20" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7c3aed]">Trophy achievement unlocked</span>
              <h3 className="font-extrabold text-base text-[#0f172a] mt-1">Badge Unlocked!</h3>
              <p className="text-xs text-[#64748b] leading-normal mt-1.5">
                Excellent! You earned the badge for successfully tackling this Git milestone. View it in your cabinet.
              </p>
            </div>

            <button
              onClick={() => setUnlockedBadgeNotification(null)}
              className="w-full py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 cursor-pointer transition-all"
            >
              Awesome, thanks!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
