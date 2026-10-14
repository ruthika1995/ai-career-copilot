import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCheck2,
  Sparkles,
  Briefcase,
  Play,
  Compass,
} from 'lucide-react';
import ScoreRing from '../components/ui/ScoreRing';
import SkillBadge from '../components/ui/SkillBadge';
import ProgressBar from '../components/ui/ProgressBar';
import { apiClient } from '../services/api';
import type { Job, JobMatch } from '../types';
import { mockJobs, mockJobMatches } from '../utils/mockData';
import { getMatchLabel, getScoreColor } from '../utils/helpers';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'evidence' | 'gaps'>('overview');
  const [job, setJob] = useState<Job>(mockJobs.find((j) => j.id === id) || mockJobs[0]);
  const [match, setMatch] = useState<JobMatch>(mockJobMatches.find((m) => m.job_id === (id || '1')) || mockJobMatches[0]);

  useEffect(() => {
    if (!id) return;
    const fetchJobData = async () => {
      try {
        const [jobsList, matchData] = await Promise.all([
          apiClient.getJobs(),
          apiClient.getJobMatch(id),
        ]);
        const found = jobsList.find((j) => j.id === id);
        if (found) setJob(found);
        if (matchData) setMatch(matchData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobData();
  }, [id]);

  const label = getMatchLabel(match.overall_score);
  const color = getScoreColor(match.overall_score);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button & Header */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-[13px] text-surface-300 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
        <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-medium ${color}`}>
                  {label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-surface-300 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium text-surface-200">
                  <Building2 className="w-4 h-4 text-brand-400" /> {job.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-surface-400" />{' '}
                  {job.parsed_requirements.experience_level}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-surface-400" /> Added{' '}
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
            <div className="text-right hidden sm:block">
              <div className="text-[12px] text-surface-400 font-medium">Fit Assessment</div>
              <div className="text-lg font-bold text-white">{match.overall_score}% Match</div>
            </div>
            <ScoreRing score={match.overall_score} size={64} strokeWidth={5} />
          </div>
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to={`/roadmap?jobId=${job.id}`}
          className="glass-card p-4 flex items-center justify-between hover:border-brand-500/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white group-hover:text-accent-300 transition-colors">
                Personalized Learning Roadmap
              </div>
              <div className="text-[12px] text-surface-400">
                Bridge {match.gap_analysis.critical_gaps.length} missing skill gaps in 4 weeks
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-accent-500/20 text-accent-300 group-hover:bg-accent-500/30 transition-colors">
            Generate Plan
          </span>
        </Link>

        <Link
          to={`/interview?jobId=${job.id}`}
          className="glass-card p-4 flex items-center justify-between hover:border-brand-500/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white group-hover:text-brand-300 transition-colors">
                Simulated Mock Interview
              </div>
              <div className="text-[12px] text-surface-400">
                Practice targeted questions based on this role
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-brand-500/20 text-brand-300 group-hover:bg-brand-500/30 transition-colors">
            Start Mock
          </span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-2">
        {(['overview', 'skills', 'evidence', 'gaps'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[14px] font-medium capitalize border-b-2 transition-all ${
              activeTab === tab
                ? 'border-brand-400 text-brand-400'
                : 'border-transparent text-surface-300 hover:text-white'
            }`}
          >
            {tab === 'gaps' ? 'Gap Analysis' : tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Category breakdown */}
            <div className="glass-card p-6">
              <h2 className="text-[15px] font-semibold text-white mb-4">
                Score Breakdown (Explainable Matching Formula)
              </h2>
              <div className="space-y-4">
                <ProgressBar
                  label="Technical Skills (Weight 40%)"
                  value={match.category_scores.technical}
                />
                <ProgressBar
                  label="Relevant Projects (Weight 25%)"
                  value={match.category_scores.projects}
                />
                <ProgressBar
                  label="Experience Match (Weight 20%)"
                  value={match.category_scores.experience}
                />
                <ProgressBar
                  label="Education Alignment (Weight 10%)"
                  value={match.category_scores.education}
                />
                <ProgressBar
                  label="Soft Skills & Adaptability (Weight 5%)"
                  value={match.category_scores.soft_skills}
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div className="glass-card p-6">
              <h2 className="text-[15px] font-semibold text-white mb-3">Key Responsibilities</h2>
              <ul className="space-y-2">
                {job.parsed_requirements.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-surface-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-[15px] font-semibold text-white mb-3">Qualifications</h2>
              <ul className="space-y-2">
                {job.parsed_requirements.qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-surface-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-brand-950/40 to-surface-900 border-brand-500/20">
              <div className="flex items-center gap-2 text-brand-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[13px] font-semibold">AI Recommendation</span>
              </div>
              <p className="text-[13px] text-surface-200 leading-relaxed">
                You have strong alignment in SQL, Docker, and REST architecture. Prioritize Java and
                Spring Boot syntax in your portfolio to convert this role to a 90%+ match.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="glass-card p-6 space-y-6">
          <div>
            <h2 className="text-[15px] font-semibold text-white mb-1">Skills Comparison Matrix</h2>
            <p className="text-[13px] text-surface-300">
              Identified from Job Description and cross-referenced with your verified profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {match.skill_matches.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-800/40 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-white">{item.skill}</span>
                    <SkillBadge
                      name={item.skill}
                      matched={item.matched}
                      matchType={item.match_type}
                    />
                  </div>
                  {item.evidence && (
                    <p className="text-[12px] text-surface-400 mt-1.5 italic">
                      &quot;{item.evidence}&quot;
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {item.similarity_score ? (
                    <span className="text-[13px] font-semibold text-brand-400">
                      {Math.round(item.similarity_score * 100)}%
                    </span>
                  ) : (
                    <span className="text-[12px] text-surface-500">Missing</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="glass-card p-6 space-y-4">
          <div>
            <h2 className="text-[15px] font-semibold text-white mb-1">
              Evidence Mapping (Explainable AI)
            </h2>
            <p className="text-[13px] text-surface-300">
              Why the system scored each skill — verifiable evidence cited directly from your
              resume.
            </p>
          </div>

          <div className="space-y-3">
            {match.evidence_map && match.evidence_map.length > 0 ? (
              match.evidence_map.map((ev, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-surface-800/30 border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-white">{ev.skill}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      Confidence: {Math.round(ev.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-[13px] text-surface-200 bg-surface-900/50 p-3 rounded-lg border border-white/5">
                    {ev.evidence}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] text-surface-400">
                    <FileCheck2 className="w-3.5 h-3.5 text-brand-400" />
                    <span>Source: {ev.source}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[13px] text-surface-400">No direct evidence entries available.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'gaps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4 border-danger-500/20">
            <div className="flex items-center gap-2 text-danger-400">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-[15px] font-semibold text-white">Critical Skill Gaps</h2>
            </div>
            <p className="text-[13px] text-surface-300">
              These are core requirements from the job description not present on your resume:
            </p>
            <div className="flex flex-wrap gap-2">
              {match.gap_analysis.critical_gaps.map((g, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-danger-500/10 text-danger-300 border border-danger-500/20"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 border-accent-500/20">
            <div className="flex items-center gap-2 text-accent-400">
              <Lightbulb className="w-5 h-5" />
              <h2 className="text-[15px] font-semibold text-white">Recommended Actions</h2>
            </div>
            <p className="text-[13px] text-surface-300">
              Targeted recommendations to upgrade your profile:
            </p>
            <ul className="space-y-2 text-[13px] text-surface-200">
              <li className="flex items-start gap-2">
                <span className="text-accent-400 font-bold">•</span>
                <span>Complete Week 1 of Java Fundamentals in your generated roadmap.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 font-bold">•</span>
                <span>
                  Refactor one existing project to demonstrate basic REST API endpoints with Spring
                  Boot.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400 font-bold">•</span>
                <span>Run the AI Interview practice session to rehearse Spring Boot questions.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
