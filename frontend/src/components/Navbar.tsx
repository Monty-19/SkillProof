import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Terminal, 
  Search, 
  Award, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  FolderGit2, 
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar: React.FC = () => {
  const { user, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const handleDemoSwitch = async (persona: string) => {
    await quickLogin(persona);
    setDemoMenuOpen(false);
    if (['student', 'aarav', 'yash', 'purva', 'sanika', 'manthan', 'manthan.c0588@gmail.com'].includes(persona)) {
      navigate('/dashboard');
    } else if (['recruiter', 'elena', 'rajesh', 'sarah'].includes(persona)) {
      navigate('/recruiter/candidates');
    } else if (persona === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white tracking-wider text-lg">SKILLPROOF</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
                  Prove what you can do.
                </span>
              </div>
            </Link>

            {/* Nav Links Desktop */}
            <div className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/challenges"
                className={`px-3 py-2 rounded-lg transition ${
                  isActive('/challenges') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Challenges
              </Link>

              {user?.role === 'STUDENT' && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive('/dashboard') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-skills"
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive('/my-skills') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    My Skills
                  </Link>
                  <Link
                    to="/projects"
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive('/projects') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Projects
                  </Link>
                  <Link
                    to="/badges"
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive('/badges') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Badges
                  </Link>
                </>
              )}

              {user?.role === 'RECRUITER' && (
                <>
                  <Link
                    to="/recruiter/candidates"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${
                      isActive('/recruiter/candidates') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Search className="w-4 h-4 text-emerald-400" />
                    Find Candidates
                  </Link>
                  <Link
                    to="/recruiter/dashboard"
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive('/recruiter/dashboard') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Analytics
                  </Link>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive('/admin/dashboard') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Admin Overview
                  </Link>
                  <Link
                    to="/admin/challenges"
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive('/admin/challenges') ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Manage Challenges
                  </Link>
                </>
              )}

              {!user && (
                <Link
                  to="/recruiter/candidates"
                  className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4 text-indigo-400" />
                  Candidate Search
                </Link>
              )}
            </div>
          </div>

          {/* Right Header Elements */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-700/40 text-indigo-300 text-xs font-semibold transition"
                title="Quick demo account switcher"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Demo Personas</span>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 max-h-[85vh] overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    Switch Demo Persona
                  </div>

                  {/* Your Account */}
                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <span>⭐ Your Account</span>
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('manthan')}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">Manthan Chavan</div>
                      <div className="text-[10px] text-slate-400 font-mono">manthan.c0588@gmail.com</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">96 Score</span>
                  </button>

                  {/* Candidates */}
                  <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1 border-t border-slate-800/80 mt-1">
                    <span>💻 Verified Candidates</span>
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('yash')}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">Yash Pimpalkar</div>
                      <div className="text-[10px] text-slate-400">Full Stack Web App Dev</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">React 94</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('purva')}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">Purva Mahajan</div>
                      <div className="text-[10px] text-slate-400">Data Analyst</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">Data 95</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('sanika')}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">Sanika Barhate</div>
                      <div className="text-[10px] text-slate-400">Cybersecurity Analyst</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">Security 96</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('student')}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">Aarav Mehta</div>
                      <div className="text-[10px] text-slate-400">Frontend / Systems</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">JS 86</span>
                  </button>

                  {/* Recruiters */}
                  <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1 border-t border-slate-800/80 mt-1">
                    <span>💼 Recruiters</span>
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('recruiter')}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">Elena Rostova</div>
                      <div className="text-[10px] text-slate-400">Apex Ventures</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Recruiter</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('rajesh')}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">Rajesh Singhania</div>
                      <div className="text-[10px] text-slate-400">Stripe / FinTech Labs</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Recruiter</span>
                  </button>

                  {/* Admin */}
                  <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1 border-t border-slate-800/80 mt-1">
                    <span>⚡ Governance</span>
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition"
                  >
                    <div>
                      <div className="font-semibold text-white">SkillProof Admin</div>
                      <div className="text-[10px] text-slate-400">Platform Ops</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* Notifications */}
                <NotificationDropdown />

                {/* Passport Link for Student */}
                {user.role === 'STUDENT' && (
                  <Link
                    to={`/passport/${user.username || user.id}`}
                    target="_blank"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold transition"
                    title="View public Proof-of-Skill Passport"
                  >
                    <span>Passport</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 transition border border-transparent hover:border-slate-700"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-white hidden sm:block max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                          {user.role}
                        </span>
                      </div>

                      {user.role === 'STUDENT' && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            Student Dashboard
                          </Link>
                          <Link
                            to={`/passport/${user.username || user.id}`}
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            Public Passport
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            Profile Settings
                          </Link>
                        </>
                      )}

                      {user.role === 'RECRUITER' && (
                        <Link
                          to="/recruiter/candidates"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                          Find Candidates
                        </Link>
                      )}

                      <div className="border-t border-slate-800 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register?role=student"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-bold transition"
                  title="Register as a Student / Candidate"
                >
                  <span>🎓 Register Student</span>
                </Link>
                <Link
                  to="/register?role=recruiter"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition hover:scale-102"
                  title="Register as an Employer / Recruiter"
                >
                  <span>💼 Register Recruiter</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/challenges"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Challenges
          </Link>
          {user?.role === 'STUDENT' && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/my-skills"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                My Skills
              </Link>
              <Link
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Projects
              </Link>
              <Link
                to={`/passport/${user.username || user.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-800"
              >
                My Skill Passport
              </Link>
            </>
          )}
          {user?.role === 'RECRUITER' && (
            <Link
              to="/recruiter/candidates"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Find Candidates
            </Link>
          )}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold px-2 uppercase tracking-wider">Quick Demo:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { handleDemoSwitch('student'); setMobileMenuOpen(false); }}
                className="p-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold"
              >
                Student
              </button>
              <button
                onClick={() => { handleDemoSwitch('recruiter'); setMobileMenuOpen(false); }}
                className="p-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold"
              >
                Recruiter
              </button>
              <button
                onClick={() => { handleDemoSwitch('admin'); setMobileMenuOpen(false); }}
                className="p-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
