import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  INITIAL_HABITS, 
  INITIAL_LOGS, 
  INITIAL_RECOVERY_PLANS, 
  INITIAL_INSIGHTS 
} from '../data/demoSeedData';
import { generateAIRecoveryPlan, detectPatternsForHabit } from '../services/aiEngine';
import { 
  fetchUserHabits, 
  saveHabitToFirestore, 
  updateHabitInFirestore, 
  deleteHabitFromFirestore,
  saveHabitLogToFirestore,
  saveRecoveryPlanToFirestore 
} from '../firebase/services';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

export function HabitProvider({ children }) {
  const { currentUser, isDemoUser } = useAuth();

  const [habits, setHabits] = useState(() => {
    const isDemo = localStorage.getItem('habit_rescue_is_demo') === 'true';
    const saved = localStorage.getItem('habit_rescue_habits');
    if (saved) return JSON.parse(saved);
    return isDemo ? INITIAL_HABITS : [];
  });

  const [logs, setLogs] = useState(() => {
    const isDemo = localStorage.getItem('habit_rescue_is_demo') === 'true';
    const saved = localStorage.getItem('habit_rescue_logs');
    if (saved) return JSON.parse(saved);
    return isDemo ? INITIAL_LOGS : [];
  });

  const [recoveryPlans, setRecoveryPlans] = useState(() => {
    const isDemo = localStorage.getItem('habit_rescue_is_demo') === 'true';
    const saved = localStorage.getItem('habit_rescue_plans');
    if (saved) return JSON.parse(saved);
    return isDemo ? INITIAL_RECOVERY_PLANS : [];
  });

  const [insights, setInsights] = useState(() => {
    const isDemo = localStorage.getItem('habit_rescue_is_demo') === 'true';
    const saved = localStorage.getItem('habit_rescue_insights');
    if (saved) return JSON.parse(saved);
    return isDemo ? INITIAL_INSIGHTS : [];
  });

  const [smartAdjustments, setSmartAdjustments] = useState([]);

  // Sync state whenever auth changes
  useEffect(() => {
    const isDemo = localStorage.getItem('habit_rescue_is_demo') === 'true';
    const savedHabits = localStorage.getItem('habit_rescue_habits');
    const savedLogs = localStorage.getItem('habit_rescue_logs');
    const savedPlans = localStorage.getItem('habit_rescue_plans');
    const savedInsights = localStorage.getItem('habit_rescue_insights');

    if (isDemo) {
      setHabits(savedHabits ? JSON.parse(savedHabits) : INITIAL_HABITS);
      setLogs(savedLogs ? JSON.parse(savedLogs) : INITIAL_LOGS);
      setRecoveryPlans(savedPlans ? JSON.parse(savedPlans) : INITIAL_RECOVERY_PLANS);
      setInsights(savedInsights ? JSON.parse(savedInsights) : INITIAL_INSIGHTS);
    } else {
      setHabits(savedHabits ? JSON.parse(savedHabits) : []);
      setLogs(savedLogs ? JSON.parse(savedLogs) : []);
      setRecoveryPlans(savedPlans ? JSON.parse(savedPlans) : []);
      setInsights(savedInsights ? JSON.parse(savedInsights) : []);
    }
  }, [currentUser?.uid, isDemoUser]);

  // Fetch Firestore habits if real logged in user
  useEffect(() => {
    if (currentUser?.uid && !isDemoUser) {
      fetchUserHabits(currentUser.uid).then((remoteHabits) => {
        if (remoteHabits && remoteHabits.length > 0) {
          setHabits(remoteHabits);
        }
      }).catch(() => {});
    }
  }, [currentUser?.uid, isDemoUser]);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('habit_rescue_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habit_rescue_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('habit_rescue_plans', JSON.stringify(recoveryPlans));
  }, [recoveryPlans]);

  useEffect(() => {
    localStorage.setItem('habit_rescue_insights', JSON.stringify(insights));
  }, [insights]);

  // Load Hackathon Demo Dataset
  const resetToDemoData = () => {
    setHabits(INITIAL_HABITS);
    setLogs(INITIAL_LOGS);
    setRecoveryPlans(INITIAL_RECOVERY_PLANS);
    setInsights(INITIAL_INSIGHTS);
    setSmartAdjustments([]);
    localStorage.setItem('habit_rescue_is_demo', 'true');
    localStorage.setItem('habit_rescue_habits', JSON.stringify(INITIAL_HABITS));
    localStorage.setItem('habit_rescue_logs', JSON.stringify(INITIAL_LOGS));
    localStorage.setItem('habit_rescue_plans', JSON.stringify(INITIAL_RECOVERY_PLANS));
    localStorage.setItem('habit_rescue_insights', JSON.stringify(INITIAL_INSIGHTS));
    window.dispatchEvent(new Event('storage'));
  };

  // Add Habit
  const addHabit = async (habitData) => {
    const userId = currentUser?.uid || 'user-123';
    const newHabit = {
      id: `habit-${Date.now()}`,
      userId,
      active: true,
      inRescueMode: false,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      ...habitData
    };
    
    setHabits(prev => [newHabit, ...prev]);

    if (currentUser?.uid && !isDemoUser) {
      try { await saveHabitToFirestore(newHabit); } catch (e) {}
    }
    return newHabit;
  };

  // Update Habit
  const updateHabit = async (id, updates) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));

    if (currentUser?.uid && !isDemoUser) {
      try { await updateHabitInFirestore(id, updates); } catch (e) {}
    }
  };

  // Delete Habit AND CASCADE DELETE all associated recovery plans, logs, insights!
  const deleteHabit = async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setRecoveryPlans(prev => prev.filter(p => p.habitId !== id));
    setLogs(prev => prev.filter(l => l.habitId !== id));
    setInsights(prev => prev.filter(i => i.habitId !== id));
    setSmartAdjustments(prev => prev.filter(a => a.habitId !== id));

    if (currentUser?.uid && !isDemoUser) {
      try { await deleteHabitFromFirestore(id); } catch (e) {}
    }
  };

  // Log Habit Status (Completed, Missed, Skipped)
  const logHabitStatus = async (habitId, status, failureReason = null, notes = '', date = null) => {
    const logDate = date || format(new Date(), 'yyyy-MM-dd');
    const habit = habits.find(h => h.id === habitId);

    const existingLogIndex = logs.findIndex(l => l.habitId === habitId && l.date === logDate);
    const newLog = {
      id: existingLogIndex >= 0 ? logs[existingLogIndex].id : `log-${Date.now()}`,
      userId: currentUser?.uid || 'user-123',
      habitId,
      date: logDate,
      status,
      failureReason,
      notes,
      createdAt: new Date().toISOString()
    };

    let updatedLogs = [];
    if (existingLogIndex >= 0) {
      updatedLogs = [...logs];
      updatedLogs[existingLogIndex] = newLog;
    } else {
      updatedLogs = [newLog, ...logs];
    }
    setLogs(updatedLogs);

    if (currentUser?.uid && !isDemoUser) {
      try { await saveHabitLogToFirestore(newLog); } catch (e) {}
    }

    // IF COMPLETED: DISMISS ANY ACTIVE/PROPOSED RECOVERY PLAN AND RETURN TO NORMAL FLOW!
    if (status === 'completed') {
      updateHabit(habitId, { inRescueMode: false });
      setRecoveryPlans(prev => prev.filter(p => p.habitId !== habitId));
    }

    // IF MISSED: TRIGGER AI RECOVERY MODE
    if (status === 'missed' && habit) {
      const recentMisses = updatedLogs.filter(l => l.habitId === habitId && l.status === 'missed');
      
      const patternInsight = detectPatternsForHabit(habit, updatedLogs);
      if (patternInsight) {
        setInsights(prev => {
          const filtered = prev.filter(i => i.id !== patternInsight.id);
          return [patternInsight, ...filtered];
        });
      }

      if (recentMisses.length >= 3 && habit.targetAmount > 10) {
        const suggestedTarget = Math.max(5, Math.round(habit.targetAmount / 2));
        setSmartAdjustments(prev => [
          ...prev.filter(a => a.habitId !== habitId),
          {
            id: `adj-${Date.now()}`,
            habitId,
            habitName: habit.name,
            currentTarget: habit.targetAmount,
            unit: habit.targetUnit,
            suggestedTarget,
            reason: `You've missed this target ${recentMisses.length} times recently. Lowering the friction to ${suggestedTarget} ${habit.targetUnit} helps build momentum.`
          }
        ]);
      }

      if (recentMisses.length >= 1 || habit.inRescueMode) {
        triggerRescueMode(habitId, failureReason, notes);
      }
    }
  };

  // Trigger Rescue Mode with Gemini AI
  const triggerRescueMode = async (habitId, failureReason = 'Too tired', userNotes = '', variation = 0) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    updateHabit(habitId, { inRescueMode: true });

    const aiPlan = await generateAIRecoveryPlan(habit, failureReason, userNotes, variation);
    aiPlan.userId = currentUser?.uid || 'user-123';
    
    setRecoveryPlans(prev => [aiPlan, ...prev.filter(p => p.habitId !== habitId)]);

    if (currentUser?.uid && !isDemoUser) {
      try { await saveRecoveryPlanToFirestore(aiPlan); } catch (e) {}
    }
    return aiPlan;
  };

  // Regenerate Another AI Plan Option
  const regenerateRecoveryPlan = (habitId) => {
    const existing = recoveryPlans.find(p => p.habitId === habitId);
    const nextVariation = ((existing?.variation || 0) + 1) % 3;
    const reason = existing?.triggerReason || 'Too tired';
    return triggerRescueMode(habitId, reason, '', nextVariation);
  };

  // Accept Proposed Recovery Plan
  const acceptRecoveryPlan = (planId) => {
    setRecoveryPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'active' } : p));
  };

  // Reject / Cancel Recovery Plan
  const rejectRecoveryPlan = (planId) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const plan = recoveryPlans.find(p => p.id === planId);
    if (plan) {
      updateHabit(plan.habitId, { inRescueMode: false });
      setRecoveryPlans(prev => prev.map(p => p.id === planId ? { 
        ...p, 
        status: 'cancelled', 
        cancelledDate: todayStr 
      } : p));
    }
  };

  // Permanently Dismiss / Delete a Recovery Plan
  const dismissRecoveryPlan = (planId) => {
    const plan = recoveryPlans.find(p => p.id === planId);
    if (plan) {
      updateHabit(plan.habitId, { inRescueMode: false });
    }
    setRecoveryPlans(prev => prev.filter(p => p.id !== planId));
  };

  // Propose New Plan Next Day after Cancellation
  const reproposeCancelledPlan = (habitId) => {
    const cancelledPlan = recoveryPlans.find(p => p.habitId === habitId && p.status === 'cancelled');
    const reason = cancelledPlan?.triggerReason || 'General Fatigue';
    return triggerRescueMode(habitId, reason, '', 1);
  };

  // Complete a Micro-Step within a Recovery Plan
  const completeMicroStep = (planId, stepNumber) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    setRecoveryPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const stepToComplete = p.steps.find(s => s.stepNumber === stepNumber);
        if (!stepToComplete) return p;

        const alreadyCompletedToday = p.steps.some(s => s.status === 'completed' && s.completedDate === todayStr);
        if (alreadyCompletedToday) return p;

        if (stepNumber > 1) {
          const previousStep = p.steps.find(s => s.stepNumber === stepNumber - 1);
          if (previousStep?.status !== 'completed') return p;
        }

        const updatedSteps = p.steps.map(s => {
          if (s.stepNumber === stepNumber) {
            return { 
              ...s, 
              status: 'completed', 
              completedDate: todayStr 
            };
          }
          return s;
        });

        const allCompleted = updatedSteps.every(s => s.status === 'completed');
        
        if (allCompleted) {
          updateHabit(p.habitId, { inRescueMode: false });
        }

        return {
          ...p,
          steps: updatedSteps,
          status: allCompleted ? 'completed' : 'active',
          currentStepIndex: allCompleted ? updatedSteps.length - 1 : stepNumber
        };
      }
      return p;
    }));
  };

  // Accept Smart Habit Target Adjustment
  const acceptSmartAdjustment = (habitId, newTarget) => {
    updateHabit(habitId, { targetAmount: newTarget });
    setSmartAdjustments(prev => prev.filter(a => a.habitId !== habitId));
  };

  // Decline Smart Adjustment
  const declineSmartAdjustment = (habitId) => {
    setSmartAdjustments(prev => prev.filter(a => a.habitId !== habitId));
  };

  const value = {
    habits,
    logs,
    recoveryPlans,
    insights,
    smartAdjustments,
    addHabit,
    updateHabit,
    deleteHabit,
    logHabitStatus,
    triggerRescueMode,
    regenerateRecoveryPlan,
    acceptRecoveryPlan,
    rejectRecoveryPlan,
    dismissRecoveryPlan,
    reproposeCancelledPlan,
    completeMicroStep,
    acceptSmartAdjustment,
    declineSmartAdjustment,
    resetToDemoData
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  return useContext(HabitContext);
}
