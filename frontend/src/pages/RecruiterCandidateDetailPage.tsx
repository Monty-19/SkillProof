import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  GitBranch, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  Award, 
  Sparkles,
  FolderGit2,
  Mail
} from 'lucide-react';
import { api } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';

export const RecruiterCandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchCandidate = async () => {
      try {
        const data = await api.getCandidate(id);
        setCandidate(data);
      } catch (err: any) {
        setError(err.message || 'Candidate not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading candidate verified evidence...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-rose-400 font-semibold">{error || 'Candidate not found'}</p>
        <Link to="/recruiter/candidates" className="text-cyan-400 text-sm font-semibold hover:underline">
          Back to Candidate Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/recruiter/candidates"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Search</span>
        </Link>
      </div>

      {/* Candidate Profile Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-5">
            {candidate.avatar ? (
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shrink-0">
                {candidate.name.charAt(0)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{candidate.name}</h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Verified Candidate
                </span>
              </div>
              <p className="text-sm font-medium text-slate-300">{candidate.headline}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                {candidate.college && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.college}
                  </span>
                )}
                {candidate.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.location}
                  </span>
                )}
                {candidate.github_url && (
                  <a
                    href={candidate.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:underline font-mono"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                )}
                {candidate.linkedin_url && (
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-400 hover:underline font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-semibold">SKILLPROOF SCORE</span>
              <span className="text-2xl font-black text-white">{candidate.overall_score}/100</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Demonstrated Ability</span>
            </div>
            <ScoreRing score={candidate.overall_score} size={64} strokeWidth={6} />
          </div>
        </div>

        {candidate.bio && (
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            {candidate.bio}
          </p>
        )}
      </div>

      {/* Demonstrated Skills Matrix */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Demonstrated Skills & Breakdown</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {candidate.demonstrated_skills?.map((sk: any, idx: number) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{sk.skill_name}</h3>
                  <span className="text-[11px] text-slate-400">{sk.category}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Demonstrated
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-slate-400">Score:</span>
                <span className="text-xl font-black text-white font-mono">{sk.score}/100</span>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between font-mono">
                <span>{sk.challenge_count} Challenges</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Challenge History with AI Evaluation Summaries */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span>Challenge Evidence & AI Evaluation Logs</span>
        </h2>

        <div className="space-y-4">
          {candidate.challenge_history?.map((ch: any) => (
            <div key={ch.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {ch.skill_name}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(ch.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{ch.challenge_title}</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Evaluated Score</span>
                    <span className="text-xl font-extrabold text-white font-mono">{ch.score}/100</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ch.github_url && (
                      <a
                        href={ch.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        title="GitHub Repository"
                      >
                        <GitBranch className="w-4 h-4 text-indigo-400" />
                      </a>
                    )}
                    {ch.live_demo_url && (
                      <a
                        href={ch.live_demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        title="Live Demo Preview"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {ch.evaluation && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="font-semibold text-emerald-400 block mb-1">AI-Assisted Evaluation Summary:</span>
                    {ch.evaluation.ai_feedback}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Functionality</span>
                      <span className="font-bold text-white">{ch.evaluation.functionality_score}/25</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">UI/UX</span>
                      <span className="font-bold text-white">{ch.evaluation.uiux_score}/25</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Responsiveness</span>
                      <span className="font-bold text-white">{ch.evaluation.responsiveness_score}/20</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Code Quality</span>
                      <span className="font-bold text-white">{ch.evaluation.code_quality_score}/20</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-slate-500 text-[10px] block">Accessibility</span>
                      <span className="font-bold text-white">{ch.evaluation.accessibility_score}/10</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verified Projects */}
      {candidate.projects && candidate.projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <span>Verified Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidate.projects.map((p: any) => (
              <div key={p.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  <div className="flex items-center gap-2">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                        <GitBranch className="w-4 h-4" />
                      </a>
                    )}
                    {p.live_demo_url && (
                      <a href={p.live_demo_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  {p.technologies}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
