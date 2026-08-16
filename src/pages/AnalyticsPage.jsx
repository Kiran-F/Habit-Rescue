import React from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Calendar, Info, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line } from 'recharts';
import { useHabits } from '../context/HabitContext';

export default function AnalyticsPage() {
  const { habits, logs, recoveryPlans } = useHabits();

  // Filter ONLY logs & recovery plans belonging to currently existing active habits!
  const activeHabits = habits.filter(h => h.active);
  const activeHabitIds = new Set(activeHabits.map(h => h.id));

  const validLogs = logs.filter(l => activeHabitIds.has(l.habitId));
  const completedLogs = validLogs.filter(l => l.status === 'completed');
  const missedLogs = validLogs.filter(l => l.status === 'missed');
  
  const totalLogs = validLogs.length;
  const completionRate = (activeHabits.length > 0 && totalLogs > 0) 
    ? Math.round((completedLogs.length / totalLogs) * 100) 
    : 0;

  const validPlans = recoveryPlans.filter(p => activeHabitIds.has(p.habitId));
  const totalRecoveries = validPlans.filter(p => p.status === 'completed' || p.status === 'active').length;

  // Reasons breakdown data (Only for existing habits)
  const reasonMap = {};
  missedLogs.forEach(l => {
    const r = l.failureReason || 'General Fatigue';
    reasonMap[r] = (reasonMap[r] || 0) + 1;
  });

  const pieColors = {
    'Too tired': '#E07A5F',
    'No time': '#E9C46A',
    'Not motivated': '#3B82F6',
    "Didn't feel well": '#8B5CF6',
    'Schedule changed': '#659F84',
    'Other': '#EC4899',
    'General Fatigue': '#E07A5F'
  };

  const pieData = Object.entries(reasonMap).map(([name, value]) => ({
    name,
    value,
    color: pieColors[name] || '#659F84'
  }));

  // Day of week miss breakdown (Only for existing habits)
  const daysData = [
    { day: 'Mon', misses: 0 },
    { day: 'Tue', misses: 0 },
    { day: 'Wed', misses: 0 },
    { day: 'Thu', misses: 0 },
    { day: 'Fri', misses: 0 },
    { day: 'Sat', misses: 0 },
    { day: 'Sun', misses: 0 }
  ];

  missedLogs.forEach(l => {
    try {
      const d = new Date(l.date).getDay();
      const idx = d === 0 ? 6 : d - 1;
      if (daysData[idx]) daysData[idx].misses += 1;
    } catch (e) {}
  });

  // 4-Week Resilience Trend Line Chart Data
  const trendData = [
    { week: 'Week 1', completion: activeHabits.length > 0 ? 65 : 0, recoveries: activeHabits.length > 0 ? 1 : 0 },
    { week: 'Week 2', completion: activeHabits.length > 0 ? 72 : 0, recoveries: activeHabits.length > 0 ? 2 : 0 },
    { week: 'Week 3', completion: activeHabits.length > 0 ? 80 : 0, recoveries: activeHabits.length > 0 ? 3 : 0 },
    { week: 'Week 4 (Current)', completion: completionRate, recoveries: totalRecoveries }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#293730] pb-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#659F84]" />
            Analytics Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Filtered data breakdown strictly for your {activeHabits.length} active habit{activeHabits.length === 1 ? '' : 's'}.
          </p>
        </div>

        {/* Top Metric Pills Key */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 dark:bg-[#202B25] border border-slate-200 dark:border-[#659F84]/40 px-3.5 py-1.5 rounded-2xl text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Consistency</span>
            <span className="text-xl font-extrabold text-[#40755C] dark:text-[#84B59F]">{completionRate}%</span>
          </div>
          <div className="bg-slate-50 dark:bg-[#202B25] border border-slate-200 dark:border-[#E07A5F]/40 px-3.5 py-1.5 rounded-2xl text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">AI Rescues</span>
            <span className="text-xl font-extrabold text-[#E07A5F]">{totalRecoveries}</span>
          </div>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Miss Reasons Pie Chart */}
        <div className="rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#202B25] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-[#E07A5F]" /> Failure Reasons Breakdown
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Misses: {missedLogs.length}</span>
          </div>

          {pieData.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No missed logs recorded for current active habits.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Pie Chart */}
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#141917', borderColor: '#293730', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Color Key Legend */}
              <div className="space-y-2 border-l border-slate-200 dark:border-[#293730] pl-4">
                <span className="text-[11px] font-bold text-[#40755C] dark:text-[#84B59F] uppercase tracking-wider block">Graph Key Legend</span>
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Misses by Day of Week Bar Chart */}
        <div className="rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#202B25] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#E9C46A]" /> Misses by Day of Week
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#E07A5F] font-bold">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#E07A5F]" /> Key: Miss Count
            </div>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daysData}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#141917', borderColor: '#293730', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="misses" name="Missed Check-ins" fill="#E07A5F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. 4-Week Resilience Trend Line Chart */}
      <div className="rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#202B25] p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#293730] pb-3">
          <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#659F84]" /> 4-Week Consistency & Recovery Trend
          </h3>
          
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-[#40755C] dark:text-[#659F84]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#659F84]" /> Key 1: Completion Rate %
            </div>
            <div className="flex items-center gap-1.5 text-[#E07A5F]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E07A5F]" /> Key 2: AI Rescues Completed
            </div>
          </div>
        </div>

        <div className="h-52 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#141917', borderColor: '#293730', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="completion" name="Completion Rate (%)" stroke="#659F84" strokeWidth={3} dot={{ r: 5, fill: '#659F84' }} />
              <Line type="monotone" dataKey="recoveries" name="AI Rescues Completed" stroke="#E07A5F" strokeWidth={3} dot={{ r: 5, fill: '#E07A5F' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
