import { format, subDays, parseISO } from 'date-fns';

/*
 * AI Service Engine for Habit Rescue powered by Groq API (Llama 3.3 70B / Llama 3.1 8B) & Google Gemini
 * Generates tailored behavioral AI recovery plans, pattern explanations, target adjustments, and weekly summaries.
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

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

// Safe JSON extractor helper
function extractJSON(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('[AI Engine] Failed to parse JSON response:', e, rawText);
    return null;
  }
}

/**
 * Generate a 4-Day Progressive AI Micro-Goal Recovery Plan using Groq API (or Gemini fallback)
 */
export async function generateAIRecoveryPlan(habit, failureReason, userNotes = '', variation = 0) {
  const target = habit.targetAmount || 30;
  const unit = habit.targetUnit || 'minutes';
  const reasonText = failureReason || 'Too tired';

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const day1 = format(subDays(new Date(), -1), 'yyyy-MM-dd');
  const day2 = format(subDays(new Date(), -2), 'yyyy-MM-dd');
  const day3 = format(subDays(new Date(), -3), 'yyyy-MM-dd');

  const variationGuides = [
    'Focus on ultra-gentle micro-starts and lowering the initial activation barrier.',
    'Focus on environmental tweaks, habit stacking, and zero-pressure consistency.',
    'Focus on mindful pacing, milestone progression, and sustainable energy renewal.'
  ];
  const variationFocus = variationGuides[variation % variationGuides.length];

  const prompt = `You are an empathetic, behavioral habit psychologist AI for "Habit Rescue".
The user missed their daily habit: "${habit.name}" (Target: ${target} ${unit}).
Category: ${habit.category || 'General'}.
Reason for missing: "${reasonText}".
Optional user notes: "${userNotes || 'None'}".
Plan Variation #${variation + 1}: ${variationFocus}

Generate a supportive 4-day progressive micro-recovery ramp-up plan to help the user gently rebuild momentum without guilt.
Output strictly valid JSON with this exact schema (no markdown formatting, no backticks, no code blocks):
{
  "explanation": "1-2 empathetic sentences tailored to overcoming ${reasonText} for ${habit.name} with this specific angle",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Distinct low-friction Step 1 Title",
      "duration": number (10-25% of ${target}),
      "unit": "${unit}",
      "description": "Empathetic action instruction for Day 1"
    },
    {
      "stepNumber": 2,
      "title": "Distinct re-engagement Step 2 Title",
      "duration": number (35-50% of ${target}),
      "unit": "${unit}",
      "description": "Empathetic action instruction for Day 2"
    },
    {
      "stepNumber": 3,
      "title": "Distinct momentum Step 3 Title",
      "duration": number (65-75% of ${target}),
      "unit": "${unit}",
      "description": "Empathetic action instruction for Day 3"
    },
    {
      "stepNumber": 4,
      "title": "Full Recovery Step 4 Title",
      "duration": ${target},
      "unit": "${unit}",
      "description": "Return to regular ${target} ${unit} target"
    }
  ]
}`;

  const activeGroqKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY || GROQ_API_KEY;
  const activeGeminiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || GEMINI_API_KEY;

  console.log(`[AI Engine] Requesting plan for "${habit.name}" (Variation ${variation})`, {
    hasGroqKey: !!activeGroqKey,
    hasGeminiKey: !!activeGeminiKey
  });

  // 1. Prioritize Groq API (Ultra-fast LPU inference)
  if (activeGroqKey && activeGroqKey.length > 5) {
    const groqCandidateModels = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768'
    ];

    for (const model of groqCandidateModels) {
      try {
        console.log(`[AI Engine] Calling Groq API with model ${model}...`);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${activeGroqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are an empathetic, behavioral habit psychologist AI for "Habit Rescue". You must output strictly valid JSON matching the requested schema with no markdown formatting.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7 + (variation * 0.15)
          })
        });

        if (response.ok) {
          const data = await response.json();
          let rawText = data?.choices?.[0]?.message?.content;
          const parsed = extractJSON(rawText);
          if (parsed && parsed.steps && parsed.steps.length === 4) {
            const stepDates = [todayStr, day1, day2, day3];
            console.log(`[AI Engine] Successfully generated plan via Groq (${model})!`);
            return {
              id: `plan-${Date.now()}`,
              habitId: habit.id,
              createdAt: new Date().toISOString(),
              createdDate: todayStr,
              triggerReason: reasonText,
              status: 'pending_approval',
              variation,
              isAIGenerated: true,
              aiModel: `${model} (Groq)`,
              currentStepIndex: 0,
              explanation: parsed.explanation || `Gradual 4-day ramp-up to recover your ${habit.name} routine without stress.`,
              steps: parsed.steps.map((s, idx) => ({
                stepNumber: s.stepNumber || idx + 1,
                title: s.title || `Day ${idx + 1}`,
                duration: Number(s.duration) || Math.max(1, Math.round(target * ((idx + 1) * 0.25))),
                unit: s.unit || unit,
                description: s.description || `Step ${idx + 1} recovery task.`,
                status: 'pending',
                date: stepDates[idx]
              }))
            };
          }
        } else {
          const errorMsg = await response.text();
          console.warn(`[AI Engine] Groq API returned ${response.status}:`, errorMsg);
        }
      } catch (err) {
        console.warn(`[AI Engine] Groq model ${model} unavailable, trying next candidate:`, err);
      }
    }
  }

  // 2. Fallback to Google Gemini API
  if (activeGeminiKey && activeGeminiKey.length > 10) {
    const candidateModels = [
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];

    for (const model of candidateModels) {
      try {
        console.log(`[AI Engine] Falling back to Gemini API (${model})...`);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeGeminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7 + (variation * 0.15)
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          const parsed = extractJSON(rawText);
          if (parsed && parsed.steps && parsed.steps.length === 4) {
            const stepDates = [todayStr, day1, day2, day3];
            console.log(`[AI Engine] Successfully generated plan via Gemini (${model})!`);
            return {
              id: `plan-${Date.now()}`,
              habitId: habit.id,
              createdAt: new Date().toISOString(),
              createdDate: todayStr,
              triggerReason: reasonText,
              status: 'pending_approval',
              variation,
              isAIGenerated: true,
              aiModel: `${model} (Gemini)`,
              currentStepIndex: 0,
              explanation: parsed.explanation || `Gradual 4-day ramp-up to recover your ${habit.name} routine without stress.`,
              steps: parsed.steps.map((s, idx) => ({
                stepNumber: s.stepNumber || idx + 1,
                title: s.title || `Day ${idx + 1}`,
                duration: Number(s.duration) || Math.max(1, Math.round(target * ((idx + 1) * 0.25))),
                unit: s.unit || unit,
                description: s.description || `Step ${idx + 1} recovery task.`,
                status: 'pending',
                date: stepDates[idx]
              }))
            };
          }
        } else {
          const errorMsg = await response.text();
          console.warn(`[AI Engine] Gemini API returned ${response.status}:`, errorMsg);
        }
      } catch (err) {
        console.warn(`[AI Engine] Gemini model ${model} unavailable, trying next candidate:`, err);
      }
    }
  }

  // 3. Deterministic Behavioral Heuristic Fallback Engine
  console.log(`[AI Engine] Using Heuristic Fallback Engine (Variation ${variation})`);
  let step1Duration, step2Duration, step3Duration, step4Duration;
  let step1Title, step2Title, step3Title, step4Title;
  let step1Desc, step2Desc, step3Desc, step4Desc;
  let explanation = '';

  if (variation === 1) {
    // Option 2: Ultra-Gentle Friction Removal
    step1Duration = Math.max(2, Math.round(target * 0.10));
    step2Duration = Math.max(5, Math.round(target * 0.25));
    step3Duration = Math.max(12, Math.round(target * 0.50));
    step4Duration = target;

    step1Title = `Day 1: Zero-Pressure Touchpoint (${step1Duration} ${unit})`;
    step2Title = `Day 2: Habit Anchor Integration (${step2Duration} ${unit})`;
    step3Title = `Day 3: Flow & Ease Session (${step3Duration} ${unit})`;
    step4Title = `Day 4: Full Return (${step4Duration} ${unit})`;

    step1Desc = `Just complete a tiny ${step1Duration} ${unit} session right after your morning routine to rebuild psychological safety.`;
    step2Desc = `Gently step up to ${step2Duration} ${unit}. Focus on presence rather than intensity.`;
    step3Desc = `Hit ${step3Duration} ${unit} comfortably without feeling rushed.`;
    step4Desc = `Back to full ${step4Duration} ${unit} target with renewed confidence!`;

    explanation = `[Variation 2: Friction-Removal Strategy] When ${reasonText.toLowerCase()} makes starting difficult, we scale down to an effortless ${step1Duration}-${unit} touchpoint to keep your neural habit pathway active without demanding willpower.`;
  } else if (variation === 2) {
    // Option 3: Mindful Schedule Shift & Habit Stacking
    step1Duration = Math.max(3, Math.round(target * 0.20));
    step2Duration = Math.max(8, Math.round(target * 0.40));
    step3Duration = Math.max(16, Math.round(target * 0.70));
    step4Duration = target;

    step1Title = `Day 1: Mindful Restart (${step1Duration} ${unit})`;
    step2Title = `Day 2: Steady Momentum (${step2Duration} ${unit})`;
    step3Title = `Day 3: Confident Rhythm (${step3Duration} ${unit})`;
    step4Title = `Day 4: Target Mastery (${step4Duration} ${unit})`;

    step1Desc = `Stack ${step1Duration} ${unit} of ${habit.name} immediately next to an existing habit you never miss.`;
    step2Desc = `Increase to ${step2Duration} ${unit} with zero distractions in a calm space.`;
    step3Desc = `Maintain a smooth rhythm for ${step3Duration} ${unit}.`;
    step4Desc = `Celebrate completing your full standard ${step4Duration} ${unit} routine!`;

    explanation = `[Variation 3: Mindful Habit Stacking] Overcoming ${reasonText.toLowerCase()} by pairing a gentle ${step1Duration}-${unit} session with an effortless existing daily anchor.`;
  } else {
    // Option 1: Standard Progressive Ramp-Up
    if (unit === 'minutes') {
      step1Duration = Math.max(5, Math.round(target * 0.15));
      step2Duration = Math.max(10, Math.round(target * 0.35));
      step3Duration = Math.max(18, Math.round(target * 0.65));
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

    step1Title = `Day 1: Micro Step (${step1Duration} ${unit})`;
    step2Title = `Day 2: Re-Engage (${step2Duration} ${unit})`;
    step3Title = `Day 3: Build Momentum (${step3Duration} ${unit})`;
    step4Title = `Day 4: Full Recovery (${step4Duration} ${unit})`;

    step1Desc = `Ultra-low friction. Complete just ${step1Duration} ${unit} to re-establish your daily momentum.`;
    step2Desc = `Slight increase to ${step2Duration} ${unit} while maintaining comfort.`;
    step3Desc = `Reach ${step3Duration} ${unit} with confidence. You are almost back!`;
    step4Desc = `Return to your standard ${step4Duration} ${unit} routine feeling refreshed and accomplished.`;

    if (reasonText.toLowerCase().includes('tired')) {
      explanation = `When fatigue sets in, pushing for a full ${target}-${unit} session creates mental resistance. We're scaling back to a ${step1Duration}-${unit} step to keep your momentum alive without draining your energy.`;
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
    triggerReason: reasonText,
    status: 'pending_approval',
    variation,
    currentStepIndex: 0,
    explanation,
    steps: [
      {
        stepNumber: 1,
        title: step1Title,
        duration: step1Duration,
        unit,
        description: step1Desc,
        status: 'pending',
        date: todayStr
      },
      {
        stepNumber: 2,
        title: step2Title,
        duration: step2Duration,
        unit,
        description: step2Desc,
        status: 'pending',
        date: day1
      },
      {
        stepNumber: 3,
        title: step3Title,
        duration: step3Duration,
        unit,
        description: step3Desc,
        status: 'pending',
        date: day2
      },
      {
        stepNumber: 4,
        title: step4Title,
        duration: step4Duration,
        unit,
        description: step4Desc,
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
    } catch (e) { }
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
