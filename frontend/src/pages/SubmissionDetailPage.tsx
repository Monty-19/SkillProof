import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ExternalLink, 
  GitBranch, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api, Submission } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';
import { useAuth } from '../context/AuthContext';

export const SubmissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    const fetchSubmission = async () => {
      try {
        const data = await api.getSubmission(id);
        setSubmission(data);
      } catch (err: any) {
        setError(err.message || 'Submission not found');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Retrieving evaluation details...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-rose-400 font-semibold">{error || 'Submission not found'}</p>
        <Link to="/dashboard" className="text-emerald-400 text-sm font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const ev = submission.evaluation;
  const totalScore = submission.score || (ev ? ev.total_score : 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {user && (
          <Link
            to={`/passport/${user.username || user.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <span>View in Proof-of-Skill Passport</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Main Score Header Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                {submission.skill_name}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                🟢 Demonstrated
              </span>
              <span className="text-xs font-mono text-slate-400">
                Evaluated {new Date(submission.submitted_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {submission.challenge_title}
            </h1>
            <p className="text-xs text-slate-400">
              Submitted by <span className="text-white font-medium">{submission.student_name || 'Student'}</span>
            </p>
          </div>

          <div className="flex items-center gap-5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Demonstrated Score</span>
              <span className="text-xl font-extrabold text-white">{totalScore}/100</span>
              <span className="text-[10px] text-emerald-400 block font-semibold">Verified Proof</span>
            </div>
            <ScoreRing score={totalScore} size={70} strokeWidth={7} />
          </div>
        </div>

        {/* AI Assisted Evaluation Label & Disclaimer */}
        <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-950/40 -mx-6 sm:-mx-8 px-6 sm:px-8 border-b border-slate-800/80">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Assisted Evaluation Report</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Provider: {ev?.evaluation_provider?.toUpperCase() || 'AI'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 italic max-w-xl">
            "AI evaluation is intended as an assistive assessment and may not perfectly represent real-world ability."
          </p>
        </div>

        {/* Dimension Breakdown Cards */}
        {ev && (
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Functionality</div>
              <div className="text-base font-extrabold text-white mt-1">
                {ev.functionality_score} <span className="text-xs text-slate-500 font-normal">/ 25</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${(ev.functionality_score / 25) * 100}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">UI / UX</div>
              <div className="text-base font-extrabold text-white mt-1">
                {ev.uiux_score} <span className="text-xs text-slate-500 font-normal">/ 25</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-teal-500 h-full rounded-full" 
                  style={{ width: `${(ev.uiux_score / 25) * 100}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Responsiveness</div>
              <div className="text-base font-extrabold text-white mt-1">
                {ev.responsiveness_score} <span className="text-xs text-slate-500 font-normal">/ 20</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full" 
                  style={{ width: `${(ev.responsiveness_score / 20) * 100}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Code Quality</div>
              <div className="text-base font-extrabold text-white mt-1">
                {ev.code_quality_score} <span className="text-xs text-slate-500 font-normal">/ 20</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full" 
                  style={{ width: `${(ev.code_quality_score / 20) * 100}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 font-medium">Accessibility</div>
              <div className="text-base font-extrabold text-white mt-1">
                {ev.accessibility_score} <span className="text-xs text-slate-500 font-normal">/ 10</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full" 
                  style={{ width: `${(ev.accessibility_score / 10) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Assessment Details: Summary, Strengths, Weaknesses, Recommendations */}
      {ev && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              AI Evaluation Summary
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              {ev.ai_feedback}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strengths */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {Array.isArray(ev.strengths) &&
                  ev.strengths.map((str: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Weaknesses / Potential Issues */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Potential Issues</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {Array.isArray(ev.weaknesses) &&
                  ev.weaknesses.map((weak: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-amber-400 font-bold mt-0.5">&bull;</span>
                      <span className="leading-relaxed">{weak}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Actionable Recommendations</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {Array.isArray(ev.recommendations) &&
                  ev.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-indigo-400 font-bold mt-0.5">&bull;</span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Artifacts & Evidence */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Submitted Evidence & Solution Architecture
        </h3>

        <div className="flex flex-wrap gap-3">
          <a
            href={submission.github_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition"
          >
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>View GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          {submission.live_demo_url && (
            <a
              href={submission.live_demo_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>Open Live Demo</span>
            </a>
          )}
        </div>

        <div className="mt-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Student Explanation:</div>
          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
            {submission.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};
