import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Play, 
  ChevronRight,
  Terminal,
  FileCode,
  Layout
} from 'lucide-react';
import { api, Challenge } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchChallenge = async () => {
      try {
        const data = await api.getChallenge(id);
        setChallenge(data);
      } catch (err: any) {
        setError(err.message || 'Challenge not found');
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading challenge specifications...</p>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-rose-400 font-semibold">{error || 'Challenge not found'}</p>
        <Link to="/challenges" className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Challenges
        </Link>
      </div>
    );
  }

  const diffColor =
    challenge.difficulty === 'BEGINNER'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : challenge.difficulty === 'INTERMEDIATE'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      : 'bg-purple-500/10 text-purple-400 border-purple-500/30';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/challenges"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Challenges</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
              {challenge.skill_name || challenge.category}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${diffColor}`}>
              {challenge.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Estimated time: ~{challenge.estimated_minutes} minutes</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {challenge.title}
          </h1>
          <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
            {challenge.description}
          </p>
        </div>

        {/* Start button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link
            to={`/challenges/${challenge.id}/work`}
            className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-102"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Challenge / Submit Work</span>
          </Link>
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Submit your solution via GitHub repo & live URL to generate verified proof.
          </span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Scenario & Requirements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario */}
          {challenge.scenario && (
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Real-World Scenario
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 font-sans">
                {challenge.scenario}
              </p>
            </div>
          )}

          {/* Requirements */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Challenge Specifications & Requirements
            </h3>
            <ul className="space-y-3">
              {Array.isArray(challenge.requirements) ? (
                challenge.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-300">{challenge.requirements}</li>
              )}
            </ul>
          </div>

          {/* Instructions */}
          {challenge.instructions && (
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Step-by-Step Guidance
              </h3>
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
                {challenge.instructions}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Evaluation Criteria */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 sticky top-24">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Assisted Evaluation</span>
              </div>
              <h3 className="text-lg font-bold text-white">Evaluation Criteria</h3>
              <p className="text-xs text-slate-400">
                Your submitted solution is evaluated against these weighted dimensions:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Functionality</div>
                  <div className="text-[11px] text-slate-400">Requirements & state persistence</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">25 pts</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">UI / UX Quality</div>
                  <div className="text-[11px] text-slate-400">Visual hierarchy & user ergonomics</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">25 pts</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Responsiveness</div>
                  <div className="text-[11px] text-slate-400">Mobile & adaptive viewport flow</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">20 pts</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Code Quality</div>
                  <div className="text-[11px] text-slate-400">Modularity & clean separation</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">20 pts</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Accessibility</div>
                  <div className="text-[11px] text-slate-400">Semantic tags & contrast compliance</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">10 pts</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300 block mb-1">Assistive Disclaimer:</span>
              "AI evaluation is intended as an assistive assessment and may not perfectly represent real-world ability."
            </div>

            <Link
              to={`/challenges/${challenge.id}/work`}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
