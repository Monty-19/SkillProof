import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#070a10] text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white tracking-wider text-lg">SKILLPROOF</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              "LinkedIn tells recruiters what candidates claim they can do. SkillProof shows what they can actually demonstrate."
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Proof-of-Skill Platform &bull; AI-Assisted Evaluation Infrastructure</span>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/challenges" className="hover:text-emerald-400 transition">Browse Challenges</Link>
              </li>
              <li>
                <Link to="/recruiter/candidates" className="hover:text-emerald-400 transition">Candidate Evidence Search</Link>
              </li>
              <li>
                <Link to="/passport/aarav_m" className="hover:text-emerald-400 transition">Public Passport Demo</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Verification Loop</h4>
            <div className="text-xs text-slate-500 space-y-1.5 font-mono">
              <div>1. Skill Selection</div>
              <div>2. Practical Challenge</div>
              <div>3. GitHub + Demo Submission</div>
              <div>4. AI-Assisted Evaluation</div>
              <div>5. Structured Proof Passport</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} SkillProof. From self-declared skills to demonstrated skills.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-mono text-[11px]">AI Model: Gemini 2.5 Flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
