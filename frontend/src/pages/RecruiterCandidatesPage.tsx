import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../api/client';
import { ScoreRing } from '../components/ScoreRing';

export const RecruiterCandidatesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [skill, setSkill] = useState(searchParams.get('skill') || 'All');
  const [minScore, setMinScore] = useState<number>(
    searchParams.get('minimum_score') ? parseInt(searchParams.get('minimum_score')!) : 80
  );
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const skillsOptions = [
    'All', 
    'JavaScript', 
    'React', 
    'Cybersecurity', 
    'Application Security',
    'Data Analysis', 
    'SQL', 
    'Python', 
    'Node.js', 
    'TypeScript',
    'Data Visualization',
    'HTML/CSS', 
    'Docker'
  ];

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.searchCandidates({
        skill: skill !== 'All' ? skill : undefined,
        minimum_score: minScore > 0 ? minScore : undefined,
        location: location || undefined,
      });
      setCandidates(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [skill, minScore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">Find Demonstrated Candidates</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/25">
              Evidence Search
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Search candidates based on verified scores from practical coding challenges, not unverified resume claims.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time capability filtering</span>
        </div>
      </div>

      {/* Filter Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Capability Filter Matrix</span>
          </span>
          <button
            onClick={() => { setSkill('All'); setMinScore(0); setLocation(''); }}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Demonstrated Skill
            </label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              {skillsOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Minimum Verified Score</span>
              <span className="text-cyan-400 font-mono font-bold">{minScore > 0 ? `${minScore}/100` : 'Any'}</span>
            </label>
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0</span>
                <span>75</span>
                <span>80 (Demo)</span>
                <span>90+</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Bangalore, San Francisco, Remote"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Candidate Results */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Querying candidate skill evidence from database...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
          <p className="text-rose-400 text-sm font-semibold">{error}</p>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : candidates.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <p className="text-slate-300 text-base font-semibold">No candidates match these specific evidence filters.</p>
          <p className="text-xs text-slate-500">Try lowering the minimum score or selecting another skill.</p>
          <button
            onClick={() => { setSkill('JavaScript'); setMinScore(70); }}
            className="text-cyan-400 font-semibold text-xs hover:underline mt-2 inline-block"
          >
            Reset to JavaScript (&ge; 70)
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400">
            Found <span className="text-white font-bold">{candidates.length}</span> verified candidate{candidates.length > 1 ? 's' : ''} with demonstrated skill proof:
          </div>

          <div className="grid grid-cols-1 gap-4">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
              >
                {/* Candidate Info */}
                <div className="flex items-start sm:items-center gap-4">
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
                      {c.name.charAt(0)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-lg">{c.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{c.headline}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {c.college && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" />
                          {c.college}
                        </span>
                      )}
                      {c.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {c.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Demonstrated Skills Pills */}
                <div className="flex-1 max-w-xl">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Demonstrated Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.demonstrated_skills?.map((sk: any, idx: number) => {
                      const isHighlighted = skill !== 'All' && sk.skill_name.toLowerCase() === skill.toLowerCase();
                      return (
                        <div
                          key={idx}
                          className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 ${
                            isHighlighted
                              ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="font-semibold">{sk.skill_name}</span>
                          <span className={`font-mono font-bold ${isHighlighted ? 'text-cyan-400' : 'text-emerald-400'}`}>
                            {sk.score}/100
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions & Proof Button */}
                <div className="flex items-center gap-5 shrink-0 self-end lg:self-center border-t lg:border-t-0 pt-4 lg:pt-0 w-full lg:w-auto justify-between lg:justify-start">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">Overall Proof</span>
                    <span className="text-lg font-black text-white">{c.overall_score}/100</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {c.challenges_completed_count} challenges &bull; {c.verified_projects_count} projects
                    </span>
                  </div>

                  <Link
                    to={`/recruiter/candidates/${c.id}`}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5"
                  >
                    <span>VIEW PROOF</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
