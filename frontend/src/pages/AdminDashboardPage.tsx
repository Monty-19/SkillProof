import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Code2, FileCheck2, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { api } from '../api/client';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, subData] = await Promise.all([
          api.getAdminStats(),
          api.getAdminSubmissions(),
        ]);
        setStats(statsData);
        setSubmissions(subData || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading platform telemetry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">Platform Administration</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold border border-purple-500/25">
              Superadmin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global metrics, challenge governance, and verified proof lifecycle monitoring.
          </p>
        </div>

        <Link
          to="/admin/challenges"
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          Manage Challenges
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="text-3xl font-extrabold text-white">{stats.total_users}</div>
            <span className="text-[11px] text-slate-500 font-mono">
              {stats.students} Students &bull; {stats.recruiters} Recruiters
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Challenges</span>
            <div className="text-3xl font-extrabold text-indigo-400">{stats.challenges}</div>
            <span className="text-[11px] text-indigo-400/80 font-mono">Across {stats.skills} Skills</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluations Run</span>
            <div className="text-3xl font-extrabold text-emerald-400">{stats.evaluations}</div>
            <span className="text-[11px] text-emerald-400/80 font-mono">AI-Assisted Scoring</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demonstrated Evidence</span>
            <div className="text-3xl font-extrabold text-amber-400">{stats.demonstrated_skills}</div>
            <span className="text-[11px] text-amber-400/80 font-mono">Verified Skills Minted</span>
          </div>
        </div>
      )}

      {/* Submissions Audit Log */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-emerald-400" />
          <span>Real-time Submissions Audit Log</span>
        </h2>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {submissions.slice(0, 10).map((sub: any, idx: number) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-white text-sm">{sub.student_name}</span>
                <span className="text-slate-400 ml-2 font-mono">({sub.student_email})</span>
                <div className="text-slate-300 mt-0.5">
                  Challenge: <span className="font-semibold text-white">{sub.challenge_title}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-slate-400 block font-mono">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{sub.score ? `${sub.score}/100` : 'Pending'}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {sub.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
