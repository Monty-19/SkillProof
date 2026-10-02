import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Award, ShieldCheck, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { api } from '../api/client';

export const RecruiterDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getRecruiterDashboard();
        setData(res);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Aggregating recruiter metrics...</p>
      </div>
    );
  }

  const { stats, top_skills, featured_candidates } = data || {
    stats: { total_candidates: 0, candidates_with_verified_skills: 0, high_performing_candidates: 0, skills_tracked: 0 },
    top_skills: [],
    featured_candidates: [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">Talent & Skill Analytics</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              Verified Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry on candidates demonstrating practical engineering capabilities.
          </p>
        </div>

        <Link
          to="/recruiter/candidates"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <Search className="w-4 h-4" />
          <span>Launch Candidate Search</span>
        </Link>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate Pool</span>
          <div className="text-3xl font-extrabold text-white">{stats.total_candidates}</div>
          <span className="text-[11px] text-slate-500 font-mono">Registered Builders</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Proof</span>
          <div className="text-3xl font-extrabold text-emerald-400">{stats.candidates_with_verified_skills}</div>
          <span className="text-[11px] text-emerald-400/80 font-mono">&ge; 1 Practical Challenge</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Performers</span>
          <div className="text-3xl font-extrabold text-cyan-400">{stats.high_performing_candidates}</div>
          <span className="text-[11px] text-cyan-400/80 font-mono">&ge; 85 Verified Score</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills Benchmarked</span>
          <div className="text-3xl font-extrabold text-indigo-400">{stats.skills_tracked}</div>
          <span className="text-[11px] text-indigo-400/80 font-mono">Across All Domains</span>
        </div>
      </div>

      {/* Top Skills Distribution */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Most Demonstrated Skills</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {top_skills.map((ts: any, idx: number) => (
            <Link
              key={idx}
              to={`/recruiter/candidates?skill=${encodeURIComponent(ts.skill_name)}&minimum_score=75`}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                  {ts.skill_name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {ts.category}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span>Demonstrated by:</span>
                <span className="font-bold text-white font-mono">{ts.demonstrated_candidates_count} candidates</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Candidates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Featured Demonstrated Talent</span>
          </h2>
          <Link to="/recruiter/candidates" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1">
            <span>Search all candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured_candidates.map((c: any) => (
            <div key={c.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">{c.name}</h3>
                <p className="text-xs text-slate-400">{c.headline}</p>
                <div className="flex gap-2 mt-2">
                  {c.demonstrated_skills?.slice(0, 3).map((sk: any, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
                      {sk.skill_name}: {sk.score}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to={`/recruiter/candidates/${c.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-bold text-xs border border-cyan-500/25 transition shrink-0"
              >
                View Proof
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
