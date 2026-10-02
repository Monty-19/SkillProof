import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Plus, 
  ExternalLink, 
  GitBranch, 
  Award, 
  Clock, 
  FolderGit2, 
  ShieldCheck, 
  Code2, 
  Layers 
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ScoreRing } from '../components/ScoreRing';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const res = await api.getStudentDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load student dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading your SkillProof evidence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-rose-400 font-semibold">{error || 'Failed to load dashboard'}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, skills, recent_submissions, badges } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/25">
              Verified Profile
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {user?.headline || 'Demonstrated Software Builder'} &bull; {user?.college || 'University'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/challenges"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Take Practical Challenge</span>
          </Link>

          <Link
            to={`/passport/${user?.username || user?.id}`}
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>View Public Passport</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Overall Score</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.overall_score}/100</span>
            <span className="text-[11px] text-emerald-400 font-medium">Verified by AI</span>
          </div>
          <ScoreRing score={stats.overall_score} size={58} strokeWidth={6} />
        </div>

        {/* Demonstrated Skills */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Skills Demonstrated</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.skills_demonstrated}</span>
            <span className="text-[11px] text-emerald-400 font-medium">🟢 Proof Recorded</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Challenges Completed */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Challenges Completed</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.challenges_completed}</span>
            <span className="text-[11px] text-indigo-400 font-medium">Practical Code</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Code2 className="w-6 h-6" />
          </div>
        </div>

        {/* Badges Earned */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Badges Earned</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.badges_count}</span>
            <span className="text-[11px] text-amber-400 font-medium">Proof Milestones</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Demonstrated Skills Grid (The Core Proof Matrix) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>My SkillProof Evidence</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified skills demonstrated through practical code challenges
            </p>
          </div>
          <Link to="/my-skills" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1">
            <span>View All Evidence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((s: any, idx: number) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{s.skill_name}</h3>
                  <span className="text-xs text-slate-400">{s.category}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Demonstrated
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Verified Score</span>
                <span className="text-2xl font-black text-white font-mono">{s.score}/100</span>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between font-mono">
                <span>{s.challenge_count} Challenges</span>
                <span>{s.project_count || 0} Projects</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Challenge Submissions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Recent Challenge Submissions</span>
          </h2>
          <Link to="/challenges" className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1">
            <span>Browse More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {recent_submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              You haven't submitted any challenges yet.{' '}
              <Link to="/challenges" className="text-emerald-400 font-semibold hover:underline">
                Take your first challenge
              </Link>
            </div>
          ) : (
            recent_submissions.map((sub: any) => (
              <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {sub.skill_name}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">{sub.challenge_title}</h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Evaluated Score</span>
                    <span className="text-lg font-extrabold text-white font-mono">{sub.score}/100</span>
                  </div>

                  <Link
                    to={`/submissions/${sub.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    View Breakdown
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Badges Preview */}
      {badges && badges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earned Badges</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {badges.map((b: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{b.name}</h4>
                  <p className="text-[11px] text-slate-400">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
