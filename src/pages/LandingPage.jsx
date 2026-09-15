import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LifeBuoy,
  CheckCircle2,
  ArrowRight,
  XCircle,
  Brain,
  RotateCcw,
  Sprout,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginWithDemo } = useAuth();

  const handleDemoClick = () => {
    loginWithDemo();
    navigate('/dashboard');
  };

  return (
    <div className="space-y-16 py-6 max-w-9xl mx-auto">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center space-y-6 pt-6 pb-4">

        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl leading-[1.15]">
          Don't punish the miss.{' '}
          <span className="bg-gradient-to-r from-[#40755C] via-[#659F84] to-[#E07A5F] dark:from-[#659F84] dark:via-[#84B59F] dark:to-[#E07A5F] bg-clip-text text-transparent">
            Rescue the habit.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
          Turn missed days into 4-day progressive micro-goals with AI pattern insights — zero streak guilt.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#659F84] hover:bg-[#52796F] text-sm font-bold text-white dark:text-[#141917] shadow-lg transition-all hover:scale-[1.02]"
          >
            Start Free
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={handleDemoClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/15 text-sm font-bold text-[#E07A5F] hover:bg-[#E07A5F]/25 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Try Interactive Demo
          </button>
        </div>

      </section>

      {/* Clinical Research Foundation Section */}
      <section className="clinical-card rounded-3xl p-6 sm:p-10 lg:p-12 bg-[#375c4b] border border-[#4a7762] shadow-2xl text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Clinical Research Text */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="section-tag text-[#A7D7C5] text-xs font-bold tracking-widest uppercase inline-block">
              CLINICAL RESEARCH FOUNDATION
            </span>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Guilt is the single biggest predictor of routine abandonment.
            </h2>

            <p className="research-body text-[#E2ECE7] text-sm sm:text-base leading-relaxed">
              Studies in behavioral economics show that punitive streaks increase cortisol and lower task self-efficacy. Habit Rescue leverages positive reinforcement and cognitive restructuring to keep the neural loop alive.
            </p>

            <div className="citation-text pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#A7D7C5] font-medium">
              <BookOpen className="h-4 w-4 shrink-0 text-[#A7D7C5]" />
              <span>Synthesizing research from Stanford, UCL, and Behavioral Insights Team</span>
            </div>
          </div>

          {/* Right Column: 3 Stat Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5">

            {/* Stat Card 1 */}
            <div className="rounded-2xl bg-[#2b483b]/80 border border-[#48735e] p-4 text-center flex flex-col items-center justify-center space-y-2 backdrop-blur-sm hover:border-[#A7D7C5]/60 transition-colors shadow-inner">
              <span className="stat-number font-heading text-2xl sm:text-3xl font-extrabold text-white">
                83%
              </span>
              <p className="stat-desc text-[11px] sm:text-xs text-[#E2ECE7] leading-snug">
                Higher 6-month habit retention vs linear streak apps
              </p>
            </div>

            {/* Stat Card 2 */}
            <div className="rounded-2xl bg-[#2b483b]/80 border border-[#48735e] p-4 text-center flex flex-col items-center justify-center space-y-2 backdrop-blur-sm hover:border-[#A7D7C5]/60 transition-colors shadow-inner">
              <span className="stat-number font-heading text-2xl sm:text-3xl font-extrabold text-white">
                4.2x
              </span>
              <p className="stat-desc text-[11px] sm:text-xs text-[#E2ECE7] leading-snug">
                Faster rebound speed following travel or illness
              </p>
            </div>

            {/* Stat Card 3 */}
            <div className="rounded-2xl bg-[#2b483b]/80 border border-[#48735e] p-4 text-center flex flex-col items-center justify-center space-y-2 backdrop-blur-sm hover:border-[#A7D7C5]/60 transition-colors shadow-inner">
              <span className="stat-number font-heading text-2xl sm:text-3xl font-extrabold text-white">
                98%
              </span>
              <p className="stat-desc text-[11px] sm:text-xs text-[#E2ECE7] leading-snug">
                Reported drastic reduction in app check-in anxiety
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Fundamental Shift / Comparison Section */}
      <section className="space-y-10 pt-4">

        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[#40755C] dark:text-[#84B59F] text-xs font-bold tracking-widest uppercase">
            THE FUNDAMENTAL SHIFT
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why streak trackers make you quit.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Psychologists call it the "What-The-Hell Effect": one minor slip-up shatters a 40-day streak, triggers shame, and leads to abandoning the habit completely. We rebuilt the tracking paradigm from scratch.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">

          {/* Left Card: Traditional Habit Trackers */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1A2520] p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-500 shrink-0">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Traditional Habit Trackers
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Rigid streaks, shame triggers & false urgency
                </p>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Streak brutally resets to zero on single miss
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Wipes away 60 days of authentic neural wiring over one sick child or delayed flight.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Triggers guilt and habitual abandonment
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Users open the app, feel moral deficit, and delete the app to avoid discomfort.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Treats all misses as willpower failures
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    No distinction between legitimate physical exhaustion, emergencies, or burnout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    All-or-nothing binary mindset
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    If you can't do the full 45-minute gym session, you log zero and feel inadequate.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Outcome Box */}
            <div className="bg-slate-100/90 dark:bg-[#141C18] rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-800 dark:text-slate-100">Average outcome:</span>{' '}
              Habit abandoned after 18 days due to first unavoidable missed day.
            </div>

          </div>

          {/* Right Card: Habit Rescue System */}
          <div className="rounded-3xl border-2 border-[#84B59F]/60 dark:border-[#659F84]/50 bg-white dark:bg-[#1A2520] p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6 relative glow-emerald">

            {/* Top Pill Badge */}
            <div className="sm:absolute top-6 sm:top-8 right-6 sm:right-8 inline-flex self-start bg-[#A7D7C5] dark:bg-[#204E3B] text-[#13422F] dark:text-[#A7D7C5] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2 sm:mb-0">
              CLINICALLY RECOMMENDED
            </div>

            {/* Header */}
            <div className="flex items-center gap-3.5 pr-0 sm:pr-36">
              <div className="w-11 h-11 rounded-2xl bg-[#D4ECE1] dark:bg-[#223E32] flex items-center justify-center text-[#2D6A4F] dark:text-[#84B59F] shrink-0">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Habit Rescue System
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Compassionate ramps, pattern memory & resilience
                </p>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#2D6A4F] dark:text-[#659F84] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    4-Day progressive micro-recovery ramp
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Auto-computes 10%, 25%, and 50% step-down targets so showing up is frictionless.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#2D6A4F] dark:text-[#659F84] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    AI obstacle & burnout pattern diagnostics
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Identifies recurring triggers (e.g., meeting-heavy Tuesdays) and adapts scheduling.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#2D6A4F] dark:text-[#659F84] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Lifetime Resilience Score replaces fragile streaks
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Measures your bounce-back speed rather than consecutive perfection. Every save adds points.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#2D6A4F] dark:text-[#659F84] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Adaptive flex modes for illness & travel
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Put habits in "Cocoon Mode" or "Nomad Mode" with 1 click without losing momentum.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Outcome Box */}
            <div className="bg-[#DCF4E7] dark:bg-[#1D3B2D] border border-[#B7E4C7]/60 dark:border-[#2D5A42] rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs text-[#13422F] dark:text-[#A7D7C5]">
                <strong className="font-bold">Outcome:</strong> 83% of users still active at Month 6.
              </span>
              <ShieldCheck className="h-4 w-4 text-[#2D6A4F] dark:text-[#84B59F] shrink-0" />
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
