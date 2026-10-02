import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async (persona: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await quickLogin(persona);
      if (['student', 'aarav', 'yash', 'purva', 'sanika', 'manthan'].includes(persona)) {
        navigate('/dashboard');
      } else if (['recruiter', 'elena', 'rajesh'].includes(persona)) {
        navigate('/recruiter/candidates');
      } else if (persona === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-4">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Sign in to SkillProof</h2>
          <p className="mt-2 text-sm text-slate-400">
            Access your verified skill evidence or recruiter portal
          </p>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Persona Login</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Click to test instantly</span>
          </div>

          {/* User Account */}
          <button
            type="button"
            onClick={() => handleDemo('manthan')}
            className="w-full py-2 px-3 text-xs bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 rounded-lg font-semibold border border-emerald-700/50 transition flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <span>⭐</span>
              <span><strong>Manthan Chavan</strong> (manthan.c0588@gmail.com)</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Score 96</span>
          </button>

          {/* Candidates */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('yash')}
              className="py-2 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold border border-slate-700 transition text-center"
              title="Full Stack Web App Developer"
            >
              💻 Yash P.
            </button>
            <button
              type="button"
              onClick={() => handleDemo('purva')}
              className="py-2 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold border border-slate-700 transition text-center"
              title="Data Analyst"
            >
              📊 Purva M.
            </button>
            <button
              type="button"
              onClick={() => handleDemo('sanika')}
              className="py-2 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold border border-slate-700 transition text-center"
              title="Cybersecurity Analyst"
            >
              🛡️ Sanika B.
            </button>
          </div>

          {/* Recruiters & Admin */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('recruiter')}
              className="py-2 px-2 text-xs bg-slate-800/80 hover:bg-slate-700 text-cyan-300 rounded-lg font-semibold border border-slate-700 transition text-center"
              title="Apex Ventures Recruiter"
            >
              💼 Elena (VC)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('rajesh')}
              className="py-2 px-2 text-xs bg-slate-800/80 hover:bg-slate-700 text-cyan-300 rounded-lg font-semibold border border-slate-700 transition text-center"
              title="Stripe Talent Partner"
            >
              💳 Rajesh (Stripe)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-2 px-2 text-xs bg-slate-800/80 hover:bg-slate-700 text-purple-300 rounded-lg font-semibold border border-slate-700 transition text-center"
              title="Admin Ops"
            >
              ⚡ Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
