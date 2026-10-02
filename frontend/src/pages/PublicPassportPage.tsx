import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  GitBranch, 
  Building, 
  MapPin, 
  Award, 
  Layers, 
  Code2, 
  Calendar,
  Sparkles,
  ArrowRight,
  FolderGit2
} from 'lucide-react';
import { api } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';

export const PublicPassportPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [passport, setPassport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;
    const fetchPassport = async () => {
      try {
        const data = await api.getPublicPassport(username);
        setPassport(data);
      } catch (err: any) {
        setError(err.message || 'Passport not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading Proof-of-Skill Passport...</p>
      </div>
    );
  }

  if (error || !passport) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <p className="text-rose-400 font-semibold">{error || 'SkillProof Passport not found'}</p>
        <Link to="/" className="text-emerald-400 text-sm font-semibold hover:underline">
          Return to SkillProof Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner with Share */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>VERIFIED SKILLPROOF PASSPORT &bull; IMMUTABLE DEMONSTRATED EVIDENCE</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Passport Link'}</span>
          </button>
        </div>
      </div>

      {/* Student Passport Card */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0d131f] border border-slate-700/80 p-6 sm:p-10 shadow-2xl relative">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-5">
            {passport.avatar ? (
              <img
                src={passport.avatar}
                alt={passport.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/40"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center border border-slate-700">
                {passport.name.charAt(0)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {passport.name}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  Verified Builder
                </span>
              </div>
              <p className="text-sm font-medium text-slate-300">
                {passport.headline}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                {passport.college && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    {passport.college}
                  </span>
                )}
                {passport.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {passport.location}
                  </span>
                )}
                {passport.github_url && (
                  <a
                    href={passport.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-400 hover:underline font-mono"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Overall Passport Score */}
          <div className="flex items-center gap-6 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-semibold">SKILLPROOF SCORE</span>
              <span className="text-2xl font-black text-white">{passport.overall_score}/100</span>
              <span className="text-[11px] text-emerald-400 block font-medium mt-0.5">
                {passport.demonstrated_skills_count} Demonstrated Skills
              </span>
            </div>
            <ScoreRing score={passport.overall_score} size={76} strokeWidth={8} />
          </div>
        </div>

        {/* Demonstrated Skills Matrix */}
        <div className="pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Demonstrated Skills & Evidence</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Proof-of-Skill Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {passport.skills.map((s: any, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{s.skill_name}</h3>
                    <span className="text-[11px] text-slate-400">{s.category}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Demonstrated
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-slate-500">Verified Score:</span>
                  <span className="text-xl font-extrabold text-white font-mono">{s.score}/100</span>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-900 flex justify-between">
                  <span>{s.challenge_count} Practical Challenges</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practical Challenge Evidence Log */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span>Challenge Performance & Public Evidence</span>
        </h2>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
          {passport.evidence_history?.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No challenge evidence recorded yet.
            </div>
          ) : (
            passport.evidence_history?.map((item: any, idx: number) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {item.skill_name}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-white text-base">{item.challenge_title}</h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Evaluated Score</span>
                    <span className="text-lg font-extrabold text-white font-mono">{item.score}/100</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.github_url && (
                      <a
                        href={item.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        title="GitHub Repository"
                      >
                        <GitBranch className="w-4 h-4 text-indigo-400" />
                      </a>
                    )}
                    {item.live_demo_url && (
                      <a
                        href={item.live_demo_url}
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
            ))
          )}
        </div>
      </div>

      {/* Verified Projects */}
      {passport.projects && passport.projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <span>Verified Software Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passport.projects.map((p: any) => (
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

      {/* Badges */}
      {passport.badges && passport.badges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earned Proof Badges</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {passport.badges.map((b: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{b.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
