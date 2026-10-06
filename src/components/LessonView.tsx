import React, { useState, useEffect } from 'react';
import { Lesson, RepoState, UserProgress } from '../types';
import Terminal from './Terminal';
import Visualizer from './Visualizer';
import AITutor from './AITutor';
import TopicIllustration from './TopicIllustration';
import { ALL_BADGES } from '../data/lessons';
import { BookOpen, HelpCircle, CheckCircle2, ChevronRight, ChevronLeft, Award, Sparkles, BrainCircuit, Play, ArrowRight, Zap, Coins, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LessonViewProps {
  key?: string;
  lesson: Lesson;
  progress: UserProgress;
  onLessonCompleted: (lessonId: string, xpEarned: number, coinsEarned: number, unlockedBadgeId?: string) => void;
  onBackToDashboard: () => void;
}

export default function LessonView({
  lesson,
  progress,
  onLessonCompleted,
  onBackToDashboard
}: LessonViewProps) {
  // Steps: 0 = Scenario & Why, 1 = Concept & Analogy, 2 = Quiz, 3 = Terminal Challenge, 4 = Celebration Summary
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);
  
  // Terminal workspace state
  const [challengeState, setChallengeState] = useState<RepoState>({ ...lesson.terminalChallenge.startingState });
  const [challengeCommandHistory, setChallengeCommandHistory] = useState<string[]>([]);
  const [completedTargetIndex, setCompletedTargetIndex] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  // Sync state if lesson changes
  useEffect(() => {
    setCurrentStep(0);
    setSelectedQuizIndex(null);
    setQuizSubmitted(false);
    setQuizIsCorrect(false);
    setChallengeState({ ...lesson.terminalChallenge.startingState });
    setChallengeCommandHistory([]);
    setCompletedTargetIndex(0);
    setChallengeSuccess(false);
  }, [lesson]);

  const handleQuizSubmit = () => {
    if (selectedQuizIndex === null) return;
    const isCorrect = selectedQuizIndex === lesson.quiz.correctAnswerIndex;
    setQuizIsCorrect(isCorrect);
    setQuizSubmitted(true);
  };

  const normalizeCommand = (cmdStr: string) => {
    return cmdStr
      .trim()
      .toLowerCase()
      .replace(/['"]/g, '"')
      .replace(/\s+/g, ' ');
  };

  const handleCommandExecuted = (cmd: string, updatedState: RepoState) => {
    // Record command history for this lesson
    const updatedHistory = [...challengeCommandHistory, cmd];
    setChallengeCommandHistory(updatedHistory);

    const targetCmds = lesson.terminalChallenge.targetCommands;
    const normalizedInput = normalizeCommand(cmd);

    let nextCompletedIndex = completedTargetIndex;
    if (completedTargetIndex < targetCmds.length) {
      const expectedCmd = normalizeCommand(targetCmds[completedTargetIndex]);
      if (normalizedInput === expectedCmd) {
        nextCompletedIndex += 1;
        setCompletedTargetIndex(nextCompletedIndex);
      }
    }

    // Check if whole target sequence was accomplished in history order
    let subseqPtr = 0;
    for (const pastCmd of updatedHistory) {
      if (subseqPtr < targetCmds.length && normalizeCommand(pastCmd) === normalizeCommand(targetCmds[subseqPtr])) {
        subseqPtr++;
      }
    }

    // State-based completion fallbacks
    let stateCompleted = false;
    if (lesson.id === 'lesson-git-init' && updatedState.isInitialized) stateCompleted = true;
    if (lesson.id === 'lesson-git-status' && normalizedInput === 'git status') stateCompleted = true;
    if (lesson.id === 'lesson-git-add' && updatedState.stagingArea.length > 0) stateCompleted = true;
    if (lesson.id === 'lesson-git-commit' && updatedState.commits.length > 0) stateCompleted = true;
    if (lesson.id === 'lesson-git-log' && (normalizedInput === 'git log' || normalizedInput === 'git log --oneline')) stateCompleted = true;
    if (lesson.id === 'lesson-git-branch' && updatedState.branches.includes('feature-lasers')) stateCompleted = true;
    if (lesson.id === 'lesson-git-merge' && updatedState.currentBranch === 'main' && (subseqPtr === targetCmds.length || updatedState.workingDirectory.some(f => f.name === 'lasers.txt'))) stateCompleted = true;
    if (lesson.id === 'lesson-git-clone' && updatedState.workingDirectory.some(f => f.name === 'readme.md')) stateCompleted = true;
    if (lesson.id === 'lesson-git-restore' && updatedState.workingDirectory.find(f => f.name === 'cookie-recipe.txt')?.status === 'committed') stateCompleted = true;
    if (lesson.id === 'lesson-git-stash' && updatedState.workingDirectory.length === 0) stateCompleted = true;

    if (nextCompletedIndex >= targetCmds.length || subseqPtr >= targetCmds.length || stateCompleted) {
      setChallengeSuccess(true);
      // Automatically warp to celebration slide after 1.5s
      setTimeout(() => {
        setCurrentStep(4);
      }, 1500);
    }
  };

  const handleCompleteLesson = () => {
    // Determine if lesson unlocks a badge
    let badgeToUnlock: string | undefined = undefined;
    if (lesson.id === 'lesson-why-vc') badgeToUnlock = 'badge-init'; // first lesson!
    if (lesson.id === 'lesson-git-init') badgeToUnlock = 'badge-init';
    if (lesson.id === 'lesson-git-commit') badgeToUnlock = 'badge-commit';
    if (lesson.id === 'lesson-git-branch') badgeToUnlock = 'badge-branch';
    if (lesson.id === 'lesson-git-stash') badgeToUnlock = 'badge-stash';
    
    // Check if whole curriculum is done for Graduate badge
    const isCurriculumCompleted = progress.completedLessons.length + 1 >= 5; // e.g. finished 5 core lessons
    if (isCurriculumCompleted) {
      badgeToUnlock = 'badge-graduate';
    }

    onLessonCompleted(lesson.id, lesson.xpReward, lesson.coinReward, badgeToUnlock);
  };

  const progressPercent = Math.round((currentStep / 4) * 100);

  return (
    <div className="flex flex-col gap-6" id="lesson-page">
      {/* Lesson Header Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] p-4 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <button 
            onClick={onBackToDashboard}
            className="text-xs text-[#7c3aed] hover:text-[#6d28d9] font-bold mb-1 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Academy Roadmap
          </button>
          <h2 className="text-lg font-extrabold text-[#0f172a] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7c3aed]" />
            <span>{lesson.title}</span>
          </h2>
        </div>

        {/* Slider Indicator Tracker */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="text-xs font-mono text-[#64748b] font-semibold">
            Section Progress: <strong className="text-[#7c3aed]">{currentStep + 1} / 5</strong>
          </div>
          <div className="w-44 h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden border border-[#e2e8f0]">
            <div 
              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Slide Carousel Layout */}
      <AnimatePresence mode="wait">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
          {/* Main Slide Content Left Column */}
          <div className="lg:col-span-8 bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[460px]">
            
            {/* Step 0: Scenario & Why exists */}
            {currentStep === 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-5"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c] bg-[#fff7ed] border border-[#ffedd5] px-3 py-1 rounded-full">
                    Step 1: The Real-World Scenario
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0f172a] mt-3 font-sans leading-snug">The Story Behind the Concept</h3>
                </div>

                <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0] leading-relaxed text-sm text-[#334155] italic">
                  "{lesson.scenario}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-[#fef2f2] rounded-xl p-4.5 border border-[#fecaca]">
                    <h4 className="text-xs font-bold text-[#dc2626] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> The Problem
                    </h4>
                    <p className="text-xs text-[#7f1d1d] mt-2 leading-relaxed">{lesson.problem}</p>
                  </div>
                  <div className="bg-[#f0fdf4] rounded-xl p-4.5 border border-[#bbf7d0]">
                    <h4 className="text-xs font-bold text-[#16a34a] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Why Git exists
                    </h4>
                    <p className="text-xs text-[#14532d] mt-2 leading-relaxed">{lesson.whyExists}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Explanation & Example */}
            {currentStep === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c3aed] bg-[#f5f3ff] border border-[#ede9fe] px-3 py-1 rounded-full">
                    Step 2: Beginner-Friendly Explanation
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0f172a] mt-3">Understanding the Mental Model</h3>
                </div>

                <div className="bg-[#f8fafc] p-5 rounded-xl border border-[#e2e8f0] flex flex-col gap-3">
                  <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-line">{lesson.explanation}</p>
                </div>

                <div className="bg-[#f5f3ff] p-4.5 rounded-xl border border-[#ede9fe]">
                  <h4 className="text-xs font-bold text-[#7c3aed] uppercase tracking-wider">💡 Relatable Example</h4>
                  <p className="text-xs text-[#5b21b6] mt-1.5 leading-relaxed">{lesson.realWorldExample}</p>
                </div>

                <div className="bg-[#f8fafc] p-4.5 rounded-xl border border-[#e2e8f0]">
                  <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">⚠️ Key Concept Notes</h4>
                  <ul className="list-disc pl-5 text-xs text-[#64748b] mt-1.5 flex flex-col gap-1 leading-relaxed">
                    {lesson.importantNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Step 2: Interactive Quiz */}
            {currentStep === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-5"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d97706] bg-[#fffbeb] border border-[#fef3c7] px-3 py-1 rounded-full">
                    Step 3: Interactive Quiz
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0f172a] mt-3">Test Your Understanding</h3>
                  <p className="text-xs text-[#64748b] mt-1">Answer this question correctly to unlock the Terminal hands-on challenge!</p>
                </div>

                <div className="bg-[#f8fafc] p-4.5 rounded-xl border border-[#e2e8f0] font-semibold text-sm text-[#0f172a]">
                  {lesson.quiz.question}
                </div>

                <div className="flex flex-col gap-3">
                  {lesson.quiz.options.map((opt, idx) => {
                    const isSelected = selectedQuizIndex === idx;
                    let optionColor = 'bg-[#ffffff] border-[#e2e8f0] hover:border-[#ddd6fe] hover:bg-[#f5f3ff]/40 text-[#0f172a]';
                    
                    if (quizSubmitted) {
                      if (idx === lesson.quiz.correctAnswerIndex) {
                        optionColor = 'bg-[#f0fdf4] border-[#22c55e] text-[#15803d] font-semibold';
                      } else if (isSelected) {
                        optionColor = 'bg-[#fef2f2] border-[#ef4444] text-[#b91c1c]';
                      } else {
                        optionColor = 'bg-[#f8fafc] border-[#e2e8f0] opacity-60 text-[#94a3b8]';
                      }
                    } else if (isSelected) {
                      optionColor = 'bg-[#f5f3ff] border-[#7c3aed] text-[#5b21b6] font-semibold shadow-xs';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !quizSubmitted && setSelectedQuizIndex(idx)}
                        disabled={quizSubmitted}
                        className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${optionColor}`}
                      >
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                          isSelected ? 'bg-[#7c3aed] text-white border-[#7c3aed]' : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#475569]'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Dialog */}
                {quizSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      quizIsCorrect 
                        ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]' 
                        : 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                      {quizIsCorrect ? '🎉 Correct! Stellar work!' : '❌ Oops! Not quite correct.'}
                    </div>
                    <p>{lesson.quiz.explanation}</p>
                  </motion.div>
                )}

                {!quizSubmitted && (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedQuizIndex === null}
                    className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#f1f5f9] disabled:text-[#94a3b8] disabled:border disabled:border-[#e2e8f0] disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    Submit Answer
                  </button>
                )}
              </motion.div>
            )}

            {/* Step 3: Terminal challenge */}
            {currentStep === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4 flex-1 justify-between"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1 rounded-full self-start">
                    Step 4: Hands-on Terminal Challenge
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0f172a] mt-2">Active Sandbox Simulation</h3>
                  <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] leading-relaxed text-xs text-[#334155]">
                    <div className="font-bold text-[#16a34a] uppercase tracking-wide text-[10px] mb-1.5 flex items-center gap-1">
                      <Play className="w-3.5 h-3.5" /> Instruction:
                    </div>
                    {lesson.terminalChallenge.instruction}
                  </div>
                </div>

                {/* Inline workspace splitter */}
                <div className="flex flex-col gap-4 mt-2">
                  <Terminal 
                    repoState={challengeState}
                    setRepoState={setChallengeState}
                    onCommandExecuted={handleCommandExecuted}
                    targetCommands={lesson.terminalChallenge.targetCommands}
                    currentCommandIndex={completedTargetIndex}
                    hints={lesson.terminalChallenge.hints}
                  />
                  
                  {challengeSuccess && (
                    <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] text-xs rounded-xl font-bold flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#f59e0b] animate-spin" />
                      <span>Challenge Solved! Unlocking rewards...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Celebration Summary */}
            {currentStep === 4 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center gap-5 py-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#f59e0b]/20 rounded-full blur-xl scale-125 animate-pulse"></div>
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shadow-2xl relative border-4 border-amber-200">
                    <Award className="w-9 h-9 animate-bounce" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#0f172a]">Congratulations!</h3>
                  <p className="text-xs text-[#64748b] mt-1 max-w-sm">
                    You have mastered <strong className="text-[#7c3aed]">{lesson.title}</strong>!
                  </p>
                </div>

                {/* Rewards widget banner */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs mt-2">
                  <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                    <Zap className="w-6 h-6 text-[#7c3aed] mb-1" />
                    <span className="text-base font-extrabold font-mono text-[#0f172a]">+{lesson.xpReward}</span>
                    <span className="text-[9px] text-[#64748b] font-bold uppercase tracking-wider">XP Earned</span>
                  </div>
                  <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                    <Coins className="w-6 h-6 text-[#f59e0b] mb-1" />
                    <span className="text-base font-extrabold font-mono text-[#0f172a]">+{lesson.coinReward}</span>
                    <span className="text-[9px] text-[#64748b] font-bold uppercase tracking-wider">Coins Earned</span>
                  </div>
                </div>

                {/* Summary points list */}
                <div className="bg-[#f8fafc] p-5 rounded-xl border border-[#e2e8f0] max-w-md w-full text-left">
                  <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2">Lesson Recap:</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    You learned how version control shields your code from accidental deletions. You practiced commands in the terminal simulator and tracked files as they moved visually from untracked states to staged and safe committed milestones.
                  </p>
                </div>

                <button
                  onClick={handleCompleteLesson}
                  className="px-8 py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Claim Rewards & Exit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Pagination Navigation Footer Controls */}
            {currentStep < 4 && (
              <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-4 mt-6">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-[#ffffff] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed text-[#334155] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#e2e8f0] flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Conditional Next Slide Actions */}
                {currentStep === 2 ? (
                  <button
                    onClick={() => quizIsCorrect && setCurrentStep(3)}
                    disabled={!quizIsCorrect}
                    className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#f1f5f9] disabled:text-[#94a3b8] disabled:border disabled:border-[#e2e8f0] disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Proceed to Terminal Challenge</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : currentStep === 3 ? (
                  <button
                    onClick={() => challengeSuccess && setCurrentStep(4)}
                    disabled={!challengeSuccess}
                    className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#f1f5f9] disabled:text-[#94a3b8] disabled:border disabled:border-[#e2e8f0] disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Proceed to Celebration</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next Section</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Right Column Side Panel Widget Spacer */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Visual Repos State mapping panel */}
            {currentStep === 3 ? (
              <Visualizer repoState={challengeState} />
            ) : (
              <TopicIllustration lessonId={lesson.id} />
            )}
            
            {/* AI Assistant Chat Tutor Companion */}
            <AITutor currentLesson={lesson} />
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
}
