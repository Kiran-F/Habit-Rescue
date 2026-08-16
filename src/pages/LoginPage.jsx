import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-emerald-900/40 bg-[#16201B]/95 p-8 shadow-2xl backdrop-blur-md glow-emerald">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Log in to check your habits and recovery plans.</p>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-3 text-xs font-medium text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-emerald-900/40 bg-[#0f1612] pl-10 pr-3.5 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-emerald-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-emerald-900/40 bg-[#0f1612] pl-10 pr-3.5 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
          >
            {loading ? 'Logging in...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="relative flex items-center justify-center py-2 text-xs text-slate-500">
          <span className="bg-[#16201B] px-3 z-10 text-slate-400 font-medium">OR CONTINUING FOR DEMO</span>
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-emerald-900/30"></div></div>
        </div>

        {/* Quick Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-orange-500/30 bg-orange-500/10 text-xs font-bold text-orange-300 hover:bg-orange-500/20 transition-colors"
        >
          <RotateCcw className="h-4 w-4 text-orange-400" />
          Explore Demo Account (Instant Access)
        </button>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-400 hover:underline">
            Register free
          </Link>
        </p>

      </div>
    </div>
  );
}
