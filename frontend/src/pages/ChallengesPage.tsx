import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  Terminal, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Code2, 
  Sparkles 
} from 'lucide-react';
import { api, Challenge } from '../api/client';

export const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const skillsList = ['All', 'JavaScript', 'React', 'HTML/CSS', 'SQL', 'Python', 'Node.js', 'UI/UX & Accessibility'];

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getChallenges({
        search: search || undefined,
        skill: selectedSkill !== 'All' ? selectedSkill : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
      });
      setChallenges(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load challenges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [selectedSkill, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchChallenges();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">Challenge Marketplace</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Practical Proof
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Build real software, submit your repository, and earn verified skill proof evaluated by AI.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search challenges by keyword, requirements, or scenario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </form>

          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Skill filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Skill Target:
          </span>
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                selectedSkill === skill
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading practical challenges...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
          <p className="text-rose-400 text-sm font-semibold">{error}</p>
          <button
            onClick={fetchChallenges}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Retry Loading
          </button>
        </div>
      ) : challenges.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <p className="text-slate-400 text-base">No challenges match your criteria.</p>
          <button
            onClick={() => { setSelectedSkill('All'); setSelectedDifficulty('All'); setSearch(''); }}
            className="text-emerald-400 text-sm font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((c) => {
            const diffColor =
              c.difficulty === 'BEGINNER'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : c.difficulty === 'INTERMEDIATE'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-purple-500/10 text-purple-400 border-purple-500/30';

            return (
              <div
                key={c.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10 group"
              >
                <div className="space-y-4">
                  {/* Category & Difficulty */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {c.skill_name || c.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${diffColor}`}>
                      {c.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {c.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>

                  {/* Requirements preview */}
                  {Array.isArray(c.requirements) && c.requirements.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Key Acceptance Criteria:</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                        {c.requirements.slice(0, 2).map((req: string, idx: number) => (
                          <li key={idx} className="line-clamp-1">{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>~{c.estimated_minutes} mins</span>
                  </div>

                  <Link
                    to={`/challenges/${c.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>View & Start</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
