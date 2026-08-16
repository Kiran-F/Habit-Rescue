import { format, subDays, parseISO } from 'date-fns';

/**
 * AI Service Engine for Habit Rescue
 * Provides supportive AI recovery plans, pattern explanations, target adjustments, and weekly summaries.
 */

export const REASON_OPTIONS = [
  { id: 'too_tired', label: 'Too tired', icon: '😴', description: 'Low physical or mental energy' },
  { id: 'no_time', label: 'No time', icon: '⏰', description: 'Schedule ran long or unexpected tasks' },
  { id: 'not_motivated', label: 'Not motivated', icon: '🔋', description: 'Felt resistant or overwhelmed' },
  { id: 'sick', label: "Didn't feel well", icon: '🤒', description: 'Physical illness or discomfort' },
  { id: 'schedule_changed', label: 'Schedule changed', icon: '📅', description: 'Travel, events, or routine shift' },
  { id: 'forgot', label: 'Forgot', icon: '🧠', description: 'Routine slipped mind' },
  { id: 'no_access', label: "Couldn't access needed gear", icon: '🚫', description: 'Missing equipment or location' },
  { id: 'other', label: 'Other reason', icon: '💬', description: 'Custom circumstance' }
];

/**
 * Generate a 4-Day Progressive AI Micro-Goal Recovery Plan
 */
export function generateAIRecoveryPlan(habit, failureReason, userNotes = '', variation = 0) {
  const target = habit.targetAmount || 30;
  const unit = habit.targetUnit || 'minutes';
  const reasonText = failureReason || 'Too tired';

  let step1Duration, step2Duration, step3Duration, step4Duration;

  if (variation === 1) {
    step1Duration = Math.max(3, Math.round(target * 0.10));
    step2Duration = Math.max(7, Math.round(target * 0.25));
    step3Duration = Math.max(12, Math.round(target * 0.50));
    step4Duration = Math.max(20, Math.round(target * 0.80));
  } else if (variation === 2) {
    step1Duration = Math.max(5, Math.round(target * 0.20));
    step2Duration = Math.max(10, Math.round(target * 0.40));
    step3Duration = Math.max(18, Math.round(target * 0.70));
    step4Duration = target;
  } else {
    if (unit === 'minutes') {
      step1Duration = Math.max(5, Math.round(target * 0.15));
      step2Duration = Math.max(10, Math.round(target * 0.35));
      step3Duration = Math.max(15, Math.round(target * 0.60));
      step4Duration = target;
    } else if (unit === 'ml' || unit === 'liters') {
      step1Duration = Math.round(target * 0.3);
      step2Duration = Math.round(target * 0.5);
      step3Duration = Math.round(target * 0.75);
      step4Duration = target;
    } else {
      step1Duration = Math.max(1, Math.round(target * 0.25));
      step2Duration = Math.max(2, Math.round(target * 0.50));
      step3Duration = Math.max(3, Math.round(target * 0.75));
      step4Duration = target;
    }
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const day1 = format(subDays(new Date(), -1), 'yyyy-MM-dd');
  const day2 = format(subDays(new Date(), -2), 'yyyy-MM-dd');
  const day3 = format(subDays(new Date(), -3), 'yyyy-MM-dd');

  let explanation = '';
  if (variation === 1) {
    explanation = `[Ultra-Gentle Option] Scale down to an absolute zero-friction ${step1Duration}-${unit} touchpoint to build momentum without any stress.`;
  } else if (variation === 2) {
    explanation = `[Mindful Schedule Shift] Break down your ${target}-${unit} routine into comfortable 3-stage milestones starting at ${step1Duration} ${unit}.`;
  } else {
    if (reasonText.toLowerCase().includes('tired')) {
      explanation = `When fatigue sets in, pushing for a full ${target}-${unit} session creates mental resistance. We're scaling back to a ${step1Duration}-minute step to keep your momentum alive without draining your energy.`;
    } else if (reasonText.toLowerCase().includes('time')) {
      explanation = `Busy schedules happen. Instead of writing off the day, a quick ${step1Duration}-${unit} touchpoint maintains your mental habit link in under 5 minutes.`;
    } else {
      explanation = `Missing a step is natural context, not a setback. This 4-day gradual ramp-up removes pressure so you can gently build back to your target.`;
    }
  }

  return {
    id: `plan-${Date.now()}`,
    habitId: habit.id,
    createdAt: new Date().toISOString(),
    createdDate: todayStr,
    triggerReason: reasonText, // Clean trigger reason
    status: 'pending_approval',
    variation,
    currentStepIndex: 0,
    explanation,
    steps: [
      {
        stepNumber: 1,
        title: `Day 1: Micro Step (${step1Duration} ${unit})`,
        duration: step1Duration,
        unit,
        description: `Ultra-low friction. Just complete ${step1Duration} ${unit} to re-establish your momentum.`,
        status: 'pending',
        date: todayStr
      },
      {
        stepNumber: 2,
        title: `Day 2: Re-Engage (${step2Duration} ${unit})`,
        duration: step2Duration,
        unit,
        description: `Slight increase to ${step2Duration} ${unit} while maintaining comfort.`,
        status: 'pending',
        date: day1
      },
      {
        stepNumber: 3,
        title: `Day 3: Build Momentum (${step3Duration} ${unit})`,
        duration: step3Duration,
        unit,
        description: `Halfway to full target (${step3Duration} ${unit}). You are almost back!`,
        status: 'pending',
        date: day2
      },
      {
        stepNumber: 4,
        title: `Day 4: Full Recovery (${step4Duration} ${unit})`,
        duration: step4Duration,
        unit,
        description: `Return to your standard ${step4Duration} ${unit} routine feeling refreshed and confident.`,
        status: 'pending',
        date: day3
      }
    ]
  };
}

/**
 * Detect Statistical Patterns from Logs & Format as AI Insights
 */
export function detectPatternsForHabit(habit, logs = []) {
  const habitLogs = logs.filter(l => l.habitId === habit.id);
  const missedLogs = habitLogs.filter(l => l.status === 'missed');

  if (missedLogs.length < 2) return null;

  const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const reasonCounts = {};

  missedLogs.forEach(log => {
    try {
      const d = parseISO(log.date);
      const dayIndex = d.getDay();
      dayCounts[dayIndex] = (dayCounts[dayIndex] || 0) + 1;

      const reason = log.failureReason || 'Unspecified';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    } catch (e) {}
  });

  let maxDayIndex = 0;
  let maxDayCount = 0;
  Object.entries(dayCounts).forEach(([dayIdx, count]) => {
    if (count > maxDayCount) {
      maxDayCount = count;
      maxDayIndex = parseInt(dayIdx);
    }
  });

  let topReason = 'Too tired';
  let topReasonCount = 0;
  Object.entries(reasonCounts).forEach(([r, count]) => {
    if (count > topReasonCount) {
      topReasonCount = count;
      topReason = r;
    }
  });

  const totalMisses = missedLogs.length;

  if (maxDayCount >= 2 && maxDayCount / totalMisses >= 0.4) {
    const dayName = dayNames[maxDayIndex];
    return {
      id: `insight-day-${habit.id}-${Date.now()}`,
      habitId: habit.id,
      type: 'day_pattern',
      title: `${dayName} Obstacle Pattern`,
      content: `You missed your "${habit.name}" habit ${totalMisses} times recently, and ${maxDayCount} of those misses occurred on ${dayName}s (primarily due to "${topReason}").`,
      recommendation: `Consider scheduling ${dayName}s as a light 10-minute touchpoint or moving this habit to earlier in the day on ${dayName}s.`,
      createdAt: new Date().toISOString()
    };
  }

  if (topReasonCount >= 2) {
    return {
      id: `insight-reason-${habit.id}-${Date.now()}`,
      habitId: habit.id,
      type: 'reason_pattern',
      title: `Primary Friction Point: ${topReason}`,
      content: `"${topReason}" is your most frequent reason for missing "${habit.name}" (${topReasonCount} of ${totalMisses} missed days).`,
      recommendation: `Try setting a micro-step backup option for days when you feel "${topReason}".`,
      createdAt: new Date().toISOString()
    };
  }

  return null;
}

/**
 * AI Weekly Summary Generator
 */
export function generateAIWeeklySummary(habits = [], logs = [], recoveryPlans = []) {
  const totalLogs = logs.length;
  const completedLogs = logs.filter(l => l.status === 'completed');
  const missedLogs = logs.filter(l => l.status === 'missed');
  
  const completionRate = totalLogs > 0 ? Math.round((completedLogs.length / totalLogs) * 100) : 100;

  const habitStats = habits.map(h => {
    const hLogs = logs.filter(l => l.habitId === h.id);
    const hComp = hLogs.filter(l => l.status === 'completed').length;
    const hMiss = hLogs.filter(l => l.status === 'missed').length;
    return { habit: h, completed: hComp, missed: hMiss, rate: hLogs.length ? (hComp / hLogs.length) : 1 };
  });

  habitStats.sort((a, b) => b.rate - a.rate);
  const bestHabit = habitStats[0]?.habit?.name || 'Daily Target';
  const hardestHabit = habitStats[habitStats.length - 1]?.habit?.name || 'Workout Routine';

  const reasonCounts = {};
  missedLogs.forEach(l => {
    const r = l.failureReason || 'General Fatigue';
    reasonCounts[r] = (reasonCounts[r] || 0) + 1;
  });
  
  let mainObstacle = 'Evening Fatigue';
  let maxCount = 0;
  Object.entries(reasonCounts).forEach(([r, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mainObstacle = r;
    }
  });

  const successfulRecoveries = recoveryPlans.filter(p => p.status === 'completed').length;

  return {
    completionRate,
    totalLogsCount: totalLogs,
    completedCount: completedLogs.length,
    missedCount: missedLogs.length,
    bestHabit,
    hardestHabit,
    mainObstacle,
    successfulRecoveries,
    summaryText: `This week you achieved a ${completionRate}% consistency rate! You demonstrated impressive resilience by initiating ${recoveryPlans.length} recovery plan${recoveryPlans.length === 1 ? '' : 's'} when obstacles arose.`,
    keyPatterns: [
      `"${bestHabit}" was your most consistent habit.`,
      `"${mainObstacle}" was the primary friction point across missed days.`,
      `You successfully rescued ${successfulRecoveries} habit routine${successfulRecoveries === 1 ? '' : 's'} without breaking momentum.`
    ],
    actionSteps: [
      `Lower friction on "${hardestHabit}" by pre-setting gear the night before.`,
      `When "${mainObstacle}" occurs, switch immediately to a 5-minute micro-step instead of a full session.`,
      `Celebrate your ${completionRate}% consistency rate — recovery counts just as much as perfection!`
    ]
  };
}
