import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Play, Award, Code2 } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ScoreRing } from '../components/ScoreRing';

export const MySkillsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getStudentDashboard();
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
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading verified skills...</p>
      </div>
    );
  }

  const skills = data?.skills || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">Demonstrated Skills</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Verified Proof
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every skill below was earned by completing practical coding challenges evaluated by AI.
          </p>
        </div>

        <Link
          to="/challenges"
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Demonstrate New Skill</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((s: any, idx: number) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-xl">{s.skill_name}</h3>
                <span className="text-xs text-slate-400">{s.category}</span>
              </div>
              <ScoreRing score={s.score} size={54} strokeWidth={5} />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  🟢 Demonstrated
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Verified Score:</span>
                <span className="text-white font-bold font-mono">{s.score}/100</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Completed Challenges:</span>
                <span className="text-white font-mono">{s.challenge_count}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                Verified {new Date(s.verified_at).toLocaleDateString()}
              </span>
              <Link
                to={`/passport/${user?.username || user?.id}`}
                target="_blank"
                className="text-emerald-400 hover:underline font-semibold"
              >
                View in Passport &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
