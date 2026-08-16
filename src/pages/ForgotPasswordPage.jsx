import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#16201B]/95 p-8 shadow-2xl backdrop-blur-md glow-emerald">
        
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#659F84]/15 border border-[#659F84]/30 text-[#659F84]">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Enter your email and we'll send a password recovery link.</p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#659F84]/20 text-[#659F84]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-xs text-[#40755C] dark:text-[#84B59F] font-medium">
              Password reset link sent to <strong>{email}</strong>. Please check your inbox.
            </p>
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#40755C] dark:text-[#84B59F] hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Log In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-3 text-red-500">{error}</div>}

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

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#659F84] hover:bg-[#52796F] font-bold text-white dark:text-[#141917] shadow-lg shadow-[#659F84]/20 transition-all hover:scale-[1.01]"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Log In
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
