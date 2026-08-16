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
  Sprout
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
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center space-y-6 pt-6 pb-8">
        
        <div className="inline-flex items-center gap-2 rounded-full border border-[#659F84]/40 bg-[#202B25] px-3.5 py-1 text-xs font-semibold text-[#84B59F]">
          <Sprout className="h-3.5 w-3.5 text-[#659F84]" />
          Empathetic AI Habit Recovery
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]">
          Don't punish the miss.{' '}
          <span className="bg-gradient-to-r from-[#659F84] via-[#84B59F] to-[#E07A5F] bg-clip-text text-transparent">
            Rescue the habit.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl">
          Turn missed days into 4-day progressive micro-goals with AI pattern insights — zero streak guilt.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#659F84] hover:bg-[#52796F] text-sm font-bold text-[#141917] shadow-lg transition-all hover:scale-[1.02]"
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

      {/* Comparison Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Traditional */}
        <div className="rounded-3xl border border-red-500/30 bg-[#202B25]/40 p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <XCircle className="h-5 w-5 text-red-400" />
            <h3 className="font-heading text-base font-bold text-white">Traditional Trackers</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2"><span className="text-red-400 font-bold">✕</span> Streak resets to zero on 1 miss</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-bold">✕</span> Guilt & habit abandonment</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-bold">✕</span> Ignores why you missed</li>
          </ul>
        </div>

        {/* Habit Rescue */}
        <div className="rounded-3xl border border-[#659F84]/50 bg-[#202B25] p-6 space-y-4 glow-emerald">
          <div className="flex items-center gap-2.5">
            <Sprout className="h-5 w-5 text-[#659F84]" />
            <h3 className="font-heading text-base font-bold text-white">Habit Rescue</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-200">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#659F84]" /> 4-day micro-step recovery</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#659F84]" /> AI obstacle pattern detection</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#659F84]" /> Long-term Resilience Score</li>
          </ul>
        </div>

      </section>

    </div>
  );
}
