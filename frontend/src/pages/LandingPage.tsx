import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Search, 
  Sparkles, 
  Cpu, 
  ExternalLink, 
  Award, 
  GitBranch, 
  Terminal, 
  Layers, 
  FileCheck2,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ScoreRing } from '../components/ScoreRing';

export const LandingPage: React.FC = () => {
  const { user, quickLogin } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0e1422] to-[#0b0f17]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Hiring Infrastructure &bull; Proof Over Resumes</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Prove what you <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">can actually do.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
              Turn practical, real-world coding challenges into structured, AI-assisted verified proof of skill that recruiters trust.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register?role=student"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>🎓 Register as Student</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register?role=recruiter"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>💼 Register as Recruiter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/recruiter/candidates"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Search Candidates</span>
              </Link>
            </div>

            {/* Demo Personas Quick Button */}
            <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-2">
              <span>Quick test:</span>
              <button
                onClick={() => quickLogin('student')}
                className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300 font-semibold"
              >
                Log in as Student Demo
              </button>
              <span>&bull;</span>
              <button
                onClick={() => quickLogin('recruiter')}
                className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300 font-semibold"
              >
                Log in as Recruiter Demo
              </button>
            </div>
          </div>

          {/* Core Demonstration Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg font-mono">
                  JS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">JavaScript</h3>
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Demonstrated
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Challenge: <span className="text-slate-200 font-medium">Build an Interactive Expense Tracker</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400 block">Verified Score</span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> 74 min completion
                  </span>
                </div>
                <ScoreRing score={86} size={64} />
              </div>
            </div>

            {/* Sub-scores breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-6 border-b border-slate-800 text-center">
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="text-[11px] text-slate-400">Functionality</div>
                <div className="text-sm font-bold text-white mt-1">23 / 25</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="text-[11px] text-slate-400">UI / UX</div>
                <div className="text-sm font-bold text-white mt-1">22 / 25</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="text-[11px] text-slate-400">Responsiveness</div>
                <div className="text-sm font-bold text-white mt-1">18 / 20</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="text-[11px] text-slate-400">Code Quality</div>
                <div className="text-sm font-bold text-white mt-1">16 / 20</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400">Accessibility</div>
                <div className="text-sm font-bold text-white mt-1">7 / 10</div>
              </div>
            </div>

            {/* Evidence details */}
            <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-semibold">Verified Evidence:</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                  github.com/student/expense-tracker
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  Live Demo Available
                </span>
              </div>
              <Link
                to="/passport/aarav_m"
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 ml-auto"
              >
                <span>View in Proof Passport</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs The Solution */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            The Fundamental Hiring Problem
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            "LinkedIn tells recruiters what candidates claim they can do. SkillProof shows what they can actually demonstrate."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Way */}
          <div className="rounded-2xl p-7 bg-slate-900/40 border border-rose-900/30 relative">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">Traditional Platforms</div>
            <h3 className="text-xl font-bold text-white mb-4">Self-Declared Claims & Certificates</h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">&times;</span>
                <span>Buzzword-heavy resumes with unverified skill bullet points ("JavaScript - Expert")</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">&times;</span>
                <span>Video course completion certificates that prove video watching, not building ability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">&times;</span>
                <span>Keyword-stuffed profiles optimized for ATS filters rather than engineering aptitude</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">&times;</span>
                <span>Recruiters spend countless screening hours guessing who can actually write clean code</span>
              </li>
            </ul>
          </div>

          {/* SkillProof Way */}
          <div className="rounded-2xl p-7 bg-slate-900/90 border border-emerald-500/40 relative shadow-xl shadow-emerald-950/20">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">The SkillProof Standard</div>
            <h3 className="text-xl font-bold text-white mb-4">Practical Challenge & AI-Assisted Evidence</h3>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Demonstrated ability: Candidates take practical real-world development tasks</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>AI-Assisted Evaluation: Code structure, edge cases, responsiveness, and accessibility analyzed</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Structured Proof Passport: Public immutable proof with GitHub repos and live previews</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Evidence-based search: Recruiters filter by verified skills & scores (e.g. JavaScript &ge; 80)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Core Verification Loop */}
      <section className="py-20 border-y border-slate-800 bg-[#090d15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The SkillProof Verification Loop
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              How students build unassailable evidence of real-world ability
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-semibold text-white text-sm">Select Skill</h4>
              <p className="text-xs text-slate-400">Choose from frontend, backend, SQL, Python, or systems</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-semibold text-white text-sm">Take Challenge</h4>
              <p className="text-xs text-slate-400">Real-world scenario with specifications & acceptance criteria</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-semibold text-white text-sm">Build & Solve</h4>
              <p className="text-xs text-slate-400">Create solution in your IDE, push to GitHub, host demo</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h4 className="font-semibold text-white text-sm">AI Evaluation</h4>
              <p className="text-xs text-slate-400">Deep assessment across 5 architectural dimensions</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h4 className="font-semibold text-white text-sm">Skill Evidence</h4>
              <p className="text-xs text-slate-400">Demonstrated status unlocked and recorded in passport</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center font-bold text-sm">
                6
              </div>
              <h4 className="font-semibold text-white text-sm">Recruiter Match</h4>
              <p className="text-xs text-slate-400">Recruiters discover your demonstrated capability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Differentiation */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800">
                For Technical Recruiters
              </span>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Stop filtering resumes. <br />
                <span className="text-cyan-400">Search demonstrated skills.</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Filter candidates by verified challenge scores, inspect GitHub pull requests, test live deployments, and read AI-assisted evaluation breakdowns before scheduling the first interview.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/recruiter/candidates"
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Demonstrated Candidates</span>
                </Link>
                <Link
                  to="/passport/aarav_m"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
                >
                  View Sample Passport
                </Link>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Recruiter Search Query</div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Skill:</span> <span className="text-white font-semibold">JavaScript</span> &bull; 
                  <span className="text-slate-500 ml-2">Min Score:</span> <span className="text-emerald-400 font-semibold">80+</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Matches
                </span>
              </div>

              {/* Sample result */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Aarav Mehta</div>
                  <div className="text-xs text-slate-400">JavaScript &bull; 86/100 Demonstrated</div>
                  <div className="text-[11px] text-emerald-400 mt-1">2 verified projects &bull; 2 challenges</div>
                </div>
                <Link
                  to="/recruiter/candidates/user-student-demo"
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold border border-slate-700"
                >
                  View Proof
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center border-t border-slate-800 bg-[#070b12]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to replace claims with verified proof?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Join students from top institutions building verifiable engineering reputations through practical code challenges.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 transition hover:scale-105"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
