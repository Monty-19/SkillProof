import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Lock, Sparkles, Layers, Zap } from 'lucide-react';
import { api } from '../api/client';

export const BadgesPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const allBadges = [
    {
      id: 'badge-first-proof',
      name: 'First Proof',
      description: 'Completed your first practical challenge and earned verified skill evidence.',
      icon: 'award',
      requirement: 'Complete 1 challenge',
    },
    {
      id: 'badge-problem-solver',
      name: 'Problem Solver',
      description: 'Demonstrated practical problem solving across multiple real-world challenges.',
      icon: 'zap',
      requirement: 'Complete 3 challenges',
    },
    {
      id: 'badge-multi-skilled',
      name: 'Full Stack Explorer',
      description: 'Demonstrated verified proficiency across at least 3 distinct technical skills.',
      icon: 'layers',
      requirement: 'Demonstrate 3 skills',
    },
    {
      id: 'badge-frontend-verified',
      name: 'Frontend Verified',
      description: 'Achieved an 85+ score on practical frontend architecture.',
      icon: 'award',
      requirement: 'Score 85+ on frontend challenge',
    },
    {
      id: 'badge-clean-code',
      name: 'Code Craftsman',
      description: 'Attained top scores for code quality, modularity, and maintainability.',
      icon: 'award',
      requirement: 'Score 18/20+ on code quality',
    },
  ];

  const earnedIds = new Set((data?.badges || []).map((b: any) => b.id || b.badge_id || b.name));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-white">SkillProof Badges</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
            Milestones
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Proof badges are awarded automatically when real database criteria and evaluation thresholds are met.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allBadges.map((b) => {
          const isEarned = (data?.badges || []).some((eb: any) => eb.name === b.name || eb.id === b.id);

          return (
            <div
              key={b.id}
              className={`p-6 rounded-2xl border transition-all ${
                isEarned
                  ? 'bg-slate-900 border-amber-500/40 shadow-xl shadow-amber-950/10'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isEarned
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isEarned ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">{b.name}</h3>
                    {isEarned ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Earned
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>

                  <div className="pt-2 text-[11px] font-mono text-slate-500">
                    Requirement: <span className="text-slate-300">{b.requirement}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
