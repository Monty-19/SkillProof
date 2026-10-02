import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  GitBranch, 
  ExternalLink, 
  FileText, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { api, Challenge } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ChallengeWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluatingStage, setEvaluatingStage] = useState<'idle' | 'uploading' | 'ai_evaluating' | 'generating_proof'>('idle');
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

  const handleFillSample = () => {
    if (!challenge) return;
    if (challenge.id === 'chal-expense-tracker') {
      setGithubUrl('https://github.com/aarav-mehta/smart-expense-tracker');
      setLiveDemoUrl('https://smart-expenses.aarav.dev');
      setExplanation(
        'Implemented a responsive expense tracker using modern JavaScript (ES6+ modules). ' +
        'Transactions are maintained with an observer-pattern store and synced to LocalStorage with schema validation. ' +
        'Integrated real-time calculation of balances, categorized tags with distinct badge colors, and dynamic input validations. ' +
        'Accessibility is ensured via semantic HTML forms, explicit label associations, and keyboard tab focus rings.'
      );
    } else {
      setGithubUrl(`https://github.com/aarav-mehta/${challenge.id}-solution`);
      setLiveDemoUrl(`https://${challenge.id}.aarav.dev`);
      setExplanation(
        `Production-ready implementation solving ${challenge.title}. Built with modular architecture, strict input sanitization, ` +
        'and mobile-first responsive CSS. Automated tests and accessibility compliance verified across breakpoints.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'STUDENT') {
      setError('Only students can submit solutions to challenges.');
      return;
    }

    setError(null);
    setSubmitting(true);
    setEvaluatingStage('uploading');

    try {
      setTimeout(() => setEvaluatingStage('ai_evaluating'), 1000);
      setTimeout(() => setEvaluatingStage('generating_proof'), 2500);

      const submission = await api.createSubmission({
        challenge_id: id,
        github_url: githubUrl,
        live_demo_url: liveDemoUrl || undefined,
        explanation: explanation,
      });

      // Redirect to submission evaluation detail page
      navigate(`/submissions/${submission.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit challenge. Please try again.');
      setSubmitting(false);
      setEvaluatingStage('idle');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Opening challenge workspace...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-rose-400 font-semibold">{error || 'Challenge not found'}</p>
        <Link to="/challenges" className="text-emerald-400 text-sm font-semibold hover:underline">
          Back to Challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to={`/challenges/${challenge.id}`}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenge Details</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              {challenge.skill_name || challenge.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">{challenge.title}</h1>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick-Fill Sample Data</span>
        </button>
      </div>

      {/* Workspace Form & Evaluation State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Submit Your Solution</h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide your repository and architecture notes. The AI-Assisted Evaluation will assess your submission against the challenge requirements.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {submitting ? (
              <div className="py-14 text-center space-y-6 bg-slate-950/60 rounded-2xl border border-slate-800 p-8">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <Cpu className="w-6 h-6 text-emerald-400 absolute" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">AI-Assisted Evaluation in Progress</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    {evaluatingStage === 'uploading' && 'Receiving submission and verifying repository URLs...'}
                    {evaluatingStage === 'ai_evaluating' && 'Running AI evaluation against challenge criteria (Functionality, UI/UX, Responsiveness, Code Quality, Accessibility)...'}
                    {evaluatingStage === 'generating_proof' && 'Finalizing scores and minting verified skill evidence in your passport...'}
                  </p>
                </div>
                <div className="flex justify-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="animate-pulse">&bull; &bull; &bull;</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                      GitHub Repository URL *
                    </span>
                    <span className="text-[11px] text-slate-500 normal-case">Public repo required</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username/interactive-expense-tracker"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      Live Demo URL (Recommended)
                    </span>
                    <span className="text-[11px] text-slate-500 normal-case">Vercel, Netlify, Cloud Run, GitHub Pages</span>
                  </label>
                  <input
                    type="url"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    placeholder="https://expense-tracker.yourdomain.dev"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      Solution Explanation & Architecture *
                    </span>
                    <span className="text-[11px] text-slate-500 normal-case">Min 20 words</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Detail your architecture, component state management, how you met the edge cases, responsiveness strategy, and accessibility implementations..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 leading-relaxed transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Solution & Run AI Evaluation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Requirements quick checklist */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Requirements Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {Array.isArray(challenge.requirements) &&
                challenge.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-300 space-y-2">
            <div className="font-semibold flex items-center gap-1.5 text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>What happens next?</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Once submitted, our backend AI Evaluation Service runs an in-depth code & requirement analysis. You will receive a breakdown of your score, strengths, and recommendations, and your demonstrated skill will be updated immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
