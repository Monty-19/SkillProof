import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Building, 
  AlertCircle, 
  Briefcase, 
  GraduationCap, 
  GitBranch, 
  MapPin, 
  Sparkles,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role')?.toUpperCase() === 'RECRUITER' ? 'RECRUITER' : 'STUDENT';
  
  const [role, setRole] = useState<'STUDENT' | 'RECRUITER'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Student Specific Fields
  const [college, setCollege] = useState('');
  const [targetDomain, setTargetDomain] = useState('Full Stack Web App Developer');
  const [githubUrl, setGithubUrl] = useState('');
  
  // Recruiter Specific Fields
  const [company, setCompany] = useState('');
  const [headline, setHeadline] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  
  // Shared
  const [location, setLocation] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const r = searchParams.get('role');
    if (r) {
      setRole(r.toUpperCase() === 'RECRUITER' ? 'RECRUITER' : 'STUDENT');
    }
  }, [searchParams]);

  const handleRoleChange = (newRole: 'STUDENT' | 'RECRUITER') => {
    setRole(newRole);
    setSearchParams({ role: newRole.toLowerCase() });
    setError(null);
  };

  const handleQuickFill = () => {
    if (role === 'STUDENT') {
      const rand = Math.floor(100 + Math.random() * 900);
      setName('Kunal Deshmukh');
      setEmail(`kunal.builder${rand}@university.edu`);
      setPassword('password123');
      setCollege('Pune Institute of Computer Technology (PICT)');
      setTargetDomain('Full Stack Web App Developer');
      setGithubUrl('https://github.com/kunal-builder');
      setLocation('Pune, India');
    } else {
      const rand = Math.floor(100 + Math.random() * 900);
      setName('Ananya Sen');
      setEmail(`ananya.talent${rand}@hypergrowth.io`);
      setPassword('password123');
      setCompany('Hypergrowth Labs');
      setHeadline('Lead Technical Recruiter & Engineering Partner');
      setLinkedinUrl('https://linkedin.com/in/ananya-sen-talent');
      setLocation('Bangalore, India');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (role === 'STUDENT') {
        await register({
          name,
          email,
          password,
          role: 'STUDENT',
          college: college || 'University',
          headline: targetDomain,
          location: location || 'India',
          github_url: githubUrl || undefined,
          bio: `Aspiring ${targetDomain}. Proving capability through practical challenges evaluated by SkillProof AI.`
        });
        navigate('/dashboard');
      } else {
        await register({
          name,
          email,
          password,
          role: 'RECRUITER',
          company: company || 'Hiring Partner',
          headline: headline || `Technical Talent Partner @ ${company || 'Tech Org'}`,
          location: location || 'Global',
          linkedin_url: linkedinUrl || undefined,
          bio: `Recruiting verified software engineering talent for ${company || 'our team'} based on demonstrated challenge scores.`
        });
        navigate('/recruiter/candidates');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Your SkillProof Account</h2>
          <p className="mt-1.5 text-xs text-slate-400 max-w-md mx-auto">
            Directly saved to the verified database. Choose your account type below.
          </p>
        </div>

        {/* Two Dedicated Registrars Switcher */}
        <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleRoleChange('STUDENT')}
            className={`py-3 px-4 rounded-xl text-left transition flex items-center gap-3 ${
              role === 'STUDENT'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              role === 'STUDENT' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-emerald-400'
            }`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold">Register As</div>
              <div className="text-sm font-black">Student / Candidate</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('RECRUITER')}
            className={`py-3 px-4 rounded-xl text-left transition flex items-center gap-3 ${
              role === 'RECRUITER'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              role === 'RECRUITER' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-cyan-400'
            }`}>
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold">Register As</div>
              <div className="text-sm font-black">Recruiter / Employer</div>
            </div>
          </button>
        </div>

        {/* Quick Autofill Helper for Demo */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Direct Database Persistence Active
          </span>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-semibold flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quick-Fill Sample {role === 'STUDENT' ? 'Student' : 'Recruiter'}</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4" onSubmit={handleSubmit}>
          
          {/* Section Indicator */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {role === 'STUDENT' ? '🎓 Student & Candidate Details' : '💼 Recruiter & Hiring Details'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-400">
              ROLE: {role}
            </span>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'STUDENT' ? 'e.g. Yash Pimpalkar' : 'e.g. Rajesh Singhania'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {role === 'STUDENT' ? 'Email Address *' : 'Work Email Address *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'STUDENT' ? 'student@university.edu' : 'recruiter@company.com'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Password & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pune, India or Remote"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          {/* ROLE SPECIFIC: Student Fields */}
          {role === 'STUDENT' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    College / University *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. PICT Pune / COEP / IIT"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Domain
                  </label>
                  <select
                    value={targetDomain}
                    onChange={(e) => setTargetDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Full Stack Web App Developer">Full Stack Web App Developer</option>
                    <option value="Data Analyst & BI Specialist">Data Analyst & BI Specialist</option>
                    <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                    <option value="Backend & Distributed Systems Engineer">Backend & Distributed Systems</option>
                    <option value="Frontend & UI/UX Engineer">Frontend & UI/UX Engineer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  GitHub Profile URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* ROLE SPECIFIC: Recruiter Fields */}
          {role === 'RECRUITER' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Company / Organization *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Stripe, Apex Ventures, Google"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Role / Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Head of Engineering Talent"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  LinkedIn / Company Website
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 ${
              role === 'STUDENT'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            {submitting ? 'Writing to database...' : `Register as ${role === 'STUDENT' ? 'Student' : 'Recruiter'} & Enter`}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80 flex items-center justify-between">
            <span>Already registered?</span>
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
              Sign In to Existing Account →
            </Link>
          </div>
        </form>

        {/* Verification Guarantee badge */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All registrations are directly stored and validated in the live SQL database.</span>
        </div>

      </div>
    </div>
  );
};
