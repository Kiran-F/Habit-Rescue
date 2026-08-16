import { subDays, format } from 'date-fns';

const todayStr = format(new Date(), 'yyyy-MM-dd');
const day1Str = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const day2Str = format(subDays(new Date(), 2), 'yyyy-MM-dd');
const day3Str = format(subDays(new Date(), 3), 'yyyy-MM-dd');
const day4Str = format(subDays(new Date(), 4), 'yyyy-MM-dd');
const day5Str = format(subDays(new Date(), 5), 'yyyy-MM-dd');
const day6Str = format(subDays(new Date(), 6), 'yyyy-MM-dd');
const day7Str = format(subDays(new Date(), 7), 'yyyy-MM-dd');

export const INITIAL_USER = {
  uid: 'demo-user-123',
  email: 'alex.habits@example.com',
  displayName: 'Alex Rivers',
  photoURL: null,
  resilienceScore: 84,
  successfulRecoveries: 6,
  totalRecoveryAttempts: 8,
  createdAt: new Date().toISOString()
};

export const INITIAL_HABITS = [
  {
    id: 'habit-exercise',
    userId: 'demo-user-123',
    name: 'Daily 30-Min Workout',
    category: 'Fitness',
    description: 'Moderate cardio and strength training to stay energized.',
    targetAmount: 30,
    targetUnit: 'minutes',
    frequency: 'daily',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: '18:00',
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    active: true,
    inRescueMode: true,
    createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd')
  },
  {
    id: 'habit-reading',
    userId: 'demo-user-123',
    name: 'Read Non-Fiction',
    category: 'Study',
    description: 'Read at least 20 minutes before sleeping.',
    targetAmount: 20,
    targetUnit: 'minutes',
    frequency: 'daily',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: '21:30',
    startDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
    active: true,
    inRescueMode: false,
    createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd')
  },
  {
    id: 'habit-water',
    userId: 'demo-user-123',
    name: 'Hydration Target',
    category: 'Hydration',
    description: 'Drink 2.5 Liters of water daily.',
    targetAmount: 2500,
    targetUnit: 'ml',
    frequency: 'daily',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTime: '12:00',
    startDate: format(subDays(new Date(), 40), 'yyyy-MM-dd'),
    active: true,
    inRescueMode: false,
    createdAt: format(subDays(new Date(), 40), 'yyyy-MM-dd')
  },
  {
    id: 'habit-meditation',
    userId: 'demo-user-123',
    name: 'Mindful Meditation',
    category: 'Mindfulness',
    description: '10-minute guided breathing and focus.',
    targetAmount: 10,
    targetUnit: 'minutes',
    frequency: 'daily',
    selectedDays: [1, 3, 5], // Mon, Wed, Fri
    reminderTime: '07:30',
    startDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    active: true,
    inRescueMode: false,
    createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd')
  }
];

export const INITIAL_LOGS = [
  // Exercise Logs
  { id: 'log-1', habitId: 'habit-exercise', date: day1Str, status: 'missed', failureReason: 'Too tired', notes: 'Had long work meetings all afternoon, completely drained.' },
  { id: 'log-2', habitId: 'habit-exercise', date: day2Str, status: 'missed', failureReason: 'No time', notes: 'Class ran over schedule.' },
  { id: 'log-3', habitId: 'habit-exercise', date: day3Str, status: 'missed', failureReason: 'Too tired', notes: 'Felt exhausted by 6 PM.' },
  { id: 'log-4', habitId: 'habit-exercise', date: day4Str, status: 'completed', failureReason: null, notes: 'Great 30 min run!' },
  { id: 'log-5', habitId: 'habit-exercise', date: day5Str, status: 'completed', failureReason: null, notes: 'Felt strong.' },
  { id: 'log-6', habitId: 'habit-exercise', date: day6Str, status: 'completed', failureReason: null, notes: 'Gym session.' },
  { id: 'log-7', habitId: 'habit-exercise', date: day7Str, status: 'missed', failureReason: 'Too tired', notes: 'Monday evening fatigue.' },

  // Reading Logs
  { id: 'log-8', habitId: 'habit-reading', date: day1Str, status: 'completed', failureReason: null, notes: 'Chapter 4 completed.' },
  { id: 'log-9', habitId: 'habit-reading', date: day2Str, status: 'completed', failureReason: null, notes: 'Read 25 mins.' },
  { id: 'log-10', habitId: 'habit-reading', date: day3Str, status: 'skipped', failureReason: 'Schedule changed', notes: 'Traveled late.' },
  { id: 'log-11', habitId: 'habit-reading', date: day4Str, status: 'completed', failureReason: null, notes: 'Very insightful chapter.' },

  // Hydration Logs
  { id: 'log-12', habitId: 'habit-water', date: day1Str, status: 'completed', failureReason: null, notes: 'Met 2.5L goal!' },
  { id: 'log-13', habitId: 'habit-water', date: day2Str, status: 'completed', failureReason: null, notes: '' },
  { id: 'log-14', habitId: 'habit-water', date: day3Str, status: 'completed', failureReason: null, notes: '' }
];

export const INITIAL_RECOVERY_PLANS = [
  {
    id: 'recovery-plan-exercise-1',
    habitId: 'habit-exercise',
    userId: 'demo-user-123',
    createdAt: new Date().toISOString(),
    triggerReason: 'Too tired (3 recent misses)',
    status: 'active',
    currentStepIndex: 0,
    explanation: 'High stress or low evening energy makes jumping into 30 full minutes daunting. Let’s ease back with zero-friction micro-goals.',
    steps: [
      { stepNumber: 1, title: 'Day 1: Light 5-Minute Walk', duration: 5, unit: 'minutes', description: 'Just put on sneakers and walk around the block or living room.', status: 'pending', date: todayStr },
      { stepNumber: 2, title: 'Day 2: 10-Minute Workout', duration: 10, unit: 'minutes', description: 'Gentle stretching or light bodyweight movements.', status: 'pending', date: format(subDays(new Date(), -1), 'yyyy-MM-dd') },
      { stepNumber: 3, title: 'Day 3: 15-Minute Workout', duration: 15, unit: 'minutes', description: 'Brisk walk or light cardio to rebuild momentum.', status: 'pending', date: format(subDays(new Date(), -2), 'yyyy-MM-dd') },
      { stepNumber: 4, title: 'Day 4: Full 30-Minute Routine', duration: 30, unit: 'minutes', description: 'Return to your regular 30-minute target feeling refreshed.', status: 'pending', date: format(subDays(new Date(), -3), 'yyyy-MM-dd') }
    ]
  }
];

export const INITIAL_INSIGHTS = [
  {
    id: 'insight-1',
    habitId: 'habit-exercise',
    type: 'day_pattern',
    title: 'Monday Fatigue Pattern Detected',
    content: 'You missed your Exercise habit 4 times this month, and 3 of those misses occurred on Mondays due to being "Too tired".',
    recommendation: 'Would you like to schedule Mondays as a light 10-minute stretch day or move evening workouts to Tuesday mornings?',
    createdAt: new Date().toISOString()
  },
  {
    id: 'insight-2',
    habitId: 'habit-reading',
    type: 'consistency_win',
    title: 'High Consistency Streak',
    content: 'Your Reading habit has an 85% completion rate over the last 30 days! Nighttime routine works great for you.',
    recommendation: 'Keep your book on your nightstand to maintain this low-friction setup.',
    createdAt: new Date().toISOString()
  }
];
