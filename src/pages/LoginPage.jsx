import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginWithDemo();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#16201B]/95 p-8 shadow-2xl backdrop-blur-md glow-emerald">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#659F84]/15 border border-[#659F84]/30 text-[#659F84]">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Log in to check your habits and recovery plans.</p>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-3 text-xs font-medium text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-black dark:text-white block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#0f1612] pl-10 pr-3.5 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#659F84] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-black dark:text-white block">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-[#40755C] dark:text-[#84B59F] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#0f1612] pl-10 pr-10 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#659F84] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-600 focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#659F84] hover:bg-[#52796F] font-bold text-white dark:text-[#141917] shadow-lg shadow-[#659F84]/20 transition-all hover:scale-[1.01]"
          >
            {loading ? 'Logging in...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="relative flex items-center justify-center py-2 text-xs text-slate-500">
          <span className="bg-white dark:bg-[#16201B] px-3 z-10 text-slate-500 dark:text-slate-400 font-semibold">OR TRY INSTANT ACCESS</span>
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-[#293730]"></div></div>
        </div>

        {/* Quick Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E07A5F]/40 bg-[#E07A5F]/15 text-xs font-bold text-[#E07A5F] hover:bg-[#E07A5F]/25 transition-colors"
        >
          <RotateCcw className="h-4 w-4 text-[#E07A5F]" />
          Explore Demo Account (Instant Access)
        </button>

        <p className="text-center text-xs text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#40755C] dark:text-[#84B59F] hover:underline">
            Register free
          </Link>
        </p>

      </div>
    </div>
  );
}
