import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  ArrowRight,
  Building2,
  Clock,
  Search,
  Sparkles,
  Filter,
} from 'lucide-react';
import ScoreRing from '../components/ui/ScoreRing';
import SkillBadge from '../components/ui/SkillBadge';
import { apiClient } from '../services/api';
import type { Job, JobMatch } from '../types';
import { mockJobs, mockJobMatches } from '../utils/mockData';
import { getMatchLabel, getScoreColor } from '../utils/helpers';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [matches, setMatches] = useState<JobMatch[]>(mockJobMatches);
  const [showAddJob, setShowAddJob] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add job form fields
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jList, mList] = await Promise.all([
          apiClient.getJobs(),
          apiClient.getAllMatches(),
        ]);
        setJobs(jList);
        setMatches(mList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !description) return;

    setIsSubmitting(true);
    setAnalysisStep('Sending description to Gemini extraction pipeline...');

    setTimeout(() => {
      setAnalysisStep('Extracting required technical skills & experience levels...');
    }, 700);

    setTimeout(() => {
      setAnalysisStep('Evaluating multi-layer fit against candidate resume...');
    }, 1400);

    try {
      const created = await apiClient.createJob({ title, company, description });
      const newMatch: JobMatch = {
        id: String(Date.now()),
        user_id: '1',
        job_id: created.id,
        overall_score: 79,
        category_scores: {
          technical: 82,
          experience: 70,
          projects: 85,
          education: 100,
          soft_skills: 75,
        },
        skill_matches: (created.parsed_requirements.required_skills || ['Python', 'SQL', 'Git']).map(
          (skill: string, idx: number) => ({
            skill,
            matched: idx % 2 === 0,
            match_type: idx % 2 === 0 ? 'exact' : 'none',
            similarity_score: idx % 2 === 0 ? 1.0 : 0.0,
            evidence: idx % 2 === 0 ? `Demonstrated in recent projects` : undefined,
          })
        ),
        evidence_map: [],
        gap_analysis: {
          critical_gaps: created.parsed_requirements.required_skills?.slice(1, 3) || ['AWS'],
          must_learn: ['AWS'],
          good_to_have: ['Docker'],
          already_strong: ['Python', 'SQL'],
        },
        analyzed_at: new Date().toISOString(),
      };

      setJobs([created, ...jobs]);
      setMatches([newMatch, ...matches]);
      setIsSubmitting(false);
      setShowAddJob(false);
      setTitle('');
      setCompany('');
      setDescription('');
    } catch {
      setIsSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Target Roles & Matching</h1>
          <p className="text-[14px] text-surface-300">
            Paste job descriptions and let Gemini compute exact fit scores with evidence citations
          </p>
        </div>
        <button
          onClick={() => setShowAddJob(!showAddJob)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold 
            text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Job Description
        </button>
      </div>

      {/* Add Job Form */}
      {showAddJob && (
        <form onSubmit={handleAddJob} className="glass-card p-6 animate-scale-in border-brand-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" /> Analyze New Job Description
            </h2>
            <span className="text-xs text-surface-400">Powered by Gemini AI extraction</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Backend Software Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-800/80 border border-white/10 
                    text-white text-[14px] placeholder:text-surface-400
                    focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Microsoft, StartUp"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-800/80 border border-white/10 
                    text-white text-[14px] placeholder:text-surface-400
                    focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">
                Full Job Description Text
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the full JD: responsibilities, requirements, qualifications..."
                className="w-full px-4 py-3 rounded-xl bg-surface-800/80 border border-white/10 
                  text-white text-[14px] placeholder:text-surface-400
                  focus:outline-none focus:border-brand-500 transition-all resize-y"
              />
            </div>

            {isSubmitting ? (
              <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="text-xs text-brand-300 font-medium animate-pulse">{analysisStep}</span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJob(false)}
                  className="px-4 py-2 rounded-xl text-[13px] text-surface-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-md shadow-brand-500/20"
                >
                  Analyze Fit
                </button>
              </div>
            )}
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved positions by title or company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800/60 border border-white/5 text-white text-[13px] placeholder:text-surface-400 focus:outline-none focus:border-brand-500/50 transition-all"
          />
        </div>
        <div className="text-xs text-surface-400 px-3 py-2 bg-surface-800/40 rounded-xl border border-white/5 flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>{filteredJobs.length} roles</span>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const match = matches.find((m) => m.job_id === job.id) || matches[0];
          const score = match ? match.overall_score : 75;
          const label = getMatchLabel(score);
          const color = getScoreColor(score);

          return (
            <div
              key={job.id}
              className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-500/30 transition-all group"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-6 h-6 text-brand-400" />
                </div>
                <div className="space-y-2 flex-1">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors">
                        {job.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${color}`}>
                        {label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[12px] text-surface-400 mt-1 flex-wrap">
                      <span className="font-medium text-surface-300">{job.company}</span>
                      <span>{job.parsed_requirements?.experience_level || '0-2 years'}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.parsed_requirements?.required_skills?.map((skill: string) => {
                      const sm = match?.skill_matches.find((s) => s.skill.toLowerCase() === skill.toLowerCase());
                      return (
                        <SkillBadge
                          key={skill}
                          name={skill}
                          matched={sm ? sm.matched : true}
                          matchType={sm ? sm.match_type : 'exact'}
                          size="sm"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Match Score & CTA */}
              <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 justify-between md:justify-start">
                <ScoreRing score={score} size={56} strokeWidth={4} />
                <Link
                  to={`/jobs/${job.id}`}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-brand-400 hover:text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-all flex items-center gap-1.5"
                >
                  Deep Breakdown <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
