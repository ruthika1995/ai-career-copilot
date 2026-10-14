import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Target,
  Mic,
  Lightbulb,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import ScoreRing from '../components/ui/ScoreRing';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import { apiClient } from '../services/api';
import type { Job, JobMatch, Profile } from '../types';
import { mockJobMatches, mockJobs, mockProfile, mockDashboardStats } from '../utils/mockData';

export default function DashboardPage() {
  const currentUser = apiClient.getCurrentUser();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [matches, setMatches] = useState<JobMatch[]>(mockJobMatches);
  const [profile, setProfile] = useState<Profile>(() => {
    const u = apiClient.getCurrentUser();
    return u ? { ...mockProfile, name: u.name, user_id: u.id } : mockProfile;
  });
  const [loading, setLoading] = useState(false);
  const [activeChart, setActiveChart] = useState<'radar' | 'bar'>('radar');

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedJobs, fetchedMatches, fetchedProfile] = await Promise.all([
        apiClient.getJobs(),
        apiClient.getAllMatches(),
        apiClient.getProfile(),
      ]);
      setJobs(fetchedJobs);
      setMatches(fetchedMatches);
      setProfile(fetchedProfile);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const topMatch = matches[0] || mockJobMatches[0];

  const radarData = [
    { subject: 'Technical', score: topMatch.category_scores.technical },
    { subject: 'Experience', score: topMatch.category_scores.experience },
    { subject: 'Projects', score: topMatch.category_scores.projects },
    { subject: 'Education', score: topMatch.category_scores.education },
    { subject: 'Soft Skills', score: topMatch.category_scores.soft_skills },
  ];

  const jobComparisonData = matches.slice(0, 4).map((m) => {
    const j = jobs.find((job) => job.id === m.job_id);
    return {
      name: j ? `${j.company}` : `Role`,
      Score: m.overall_score,
      Technical: m.category_scores.technical,
      Projects: m.category_scores.projects,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {currentUser?.name || profile.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Connected
            </span>
          </div>
          <p className="text-[14px] text-surface-300">
            Real-time career intelligence powered by Gemini & PostgreSQL
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl text-[13px] font-medium text-surface-300 hover:text-white bg-surface-800/80 hover:bg-surface-700/80 border border-white/5 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
            Sync Real-time
          </button>
          <Link
            to="/jobs"
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
          >
            <Sparkles className="w-4 h-4" /> Match New Job
          </Link>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          icon={Briefcase}
          label="Jobs Analyzed"
          value={jobs.length}
          color="brand"
        />
        <StatCard
          icon={Mic}
          label="Interviews Taken"
          value={mockDashboardStats.interviewsTaken}
          color="accent"
        />
        <StatCard
          icon={Lightbulb}
          label="Skills Identified"
          value={profile.projects?.reduce((acc, p) => acc + (p.technologies?.length || 0), 0) || 12}
          color="warning"
        />
        <StatCard
          icon={Target}
          label="Critical Gaps"
          value={topMatch.gap_analysis.critical_gaps.length}
          color="danger"
        />
      </div>

      {/* Main Grid: Readiness + Fit Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Readiness Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-surface-400">
                Career Readiness Index
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-medium">
                Target Role
              </span>
            </div>

            <div className="flex items-center justify-center py-6">
              <ScoreRing score={topMatch.overall_score} size={150} strokeWidth={10} />
            </div>

            <p className="text-center text-[14px] text-surface-300 mb-6">
              Strong alignment in projects & technical breadth. Bridging Spring Boot will push readiness to 90%+.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <ProgressBar
              label="Technical Foundation"
              value={topMatch.category_scores.technical}
            />
            <ProgressBar
              label="Projects Depth"
              value={topMatch.category_scores.projects}
            />
            <ProgressBar
              label="Experience Alignment"
              value={topMatch.category_scores.experience}
            />
          </div>
        </div>

        {/* Dynamic Multi-Dimensional Visualization */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-white">Competency Alignment Analysis</h2>
              <p className="text-[13px] text-surface-400">
                Evaluating verified credentials against market requirements
              </p>
            </div>
            <div className="flex items-center bg-surface-800 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveChart('radar')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeChart === 'radar' ? 'bg-brand-500 text-white' : 'text-surface-400 hover:text-white'
                }`}
              >
                Radar Fit
              </button>
              <button
                onClick={() => setActiveChart('bar')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeChart === 'bar' ? 'bg-brand-500 text-white' : 'text-surface-400 hover:text-white'
                }`}
              >
                Roles Comparison
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            {activeChart === 'radar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#8888b0', fontSize: 12 }}
                  />
                  <Radar
                    name="Candidate"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.25}
                    isAnimationActive={true}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobComparisonData}>
                  <XAxis dataKey="name" stroke="#5a5a8a" fontSize={12} />
                  <YAxis stroke="#5a5a8a" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111127', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Technical" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-surface-400 border-t border-white/5">
            <div>
              <span className="text-white font-semibold">Highest:</span>{' '}
              <span className="text-accent-400">Projects (91%)</span>
            </div>
            <div>
              <span className="text-white font-semibold">Top Opportunity:</span>{' '}
              <span className="text-warning-400">Java / Spring</span>
            </div>
            <div>
              <span className="text-white font-semibold">Target Fit:</span>{' '}
              <span className="text-brand-400">Google SWE (82%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Job Fits & Next Step Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-white">Analyzed Job Opportunities</h2>
            <Link
              to="/jobs"
              className="text-[13px] text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {matches.map((match) => {
              const job = jobs.find((j) => j.id === match.job_id) || jobs[0];
              if (!job) return null;
              return (
                <Link
                  key={match.id}
                  to={`/jobs/${job.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/40 border border-white/5 
                    hover:border-brand-500/30 hover:bg-surface-800/70 transition-all group"
                >
                  <ScoreRing score={match.overall_score} size={48} strokeWidth={4} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-white group-hover:text-brand-300 transition-colors">
                        {job.title}
                      </h3>
                      <span className="text-xs text-surface-400">at {job.company}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-surface-300">
                        {match.gap_analysis.critical_gaps.length > 0
                          ? `Gaps: ${match.gap_analysis.critical_gaps.join(', ')}`
                          : 'Zero critical gaps'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action center */}
        <div className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-accent-400">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-[15px] font-semibold text-white">Recommended Next Steps</h2>
            </div>

            <div className="space-y-3">
              <Link
                to="/roadmap"
                className="block p-3.5 rounded-xl bg-surface-800/40 border border-white/5 hover:border-accent-500/30 transition-all"
              >
                <div className="text-[13px] font-medium text-white mb-1">
                  Start Week 1 Sprint
                </div>
                <div className="text-[11px] text-surface-400">
                  Java fundamentals & collections for Google SWE
                </div>
              </Link>

              <Link
                to="/interview"
                className="block p-3.5 rounded-xl bg-surface-800/40 border border-white/5 hover:border-brand-500/30 transition-all"
              >
                <div className="text-[13px] font-medium text-white mb-1">
                  Simulate Mock Interview
                </div>
                <div className="text-[11px] text-surface-400">
                  Practice 3 adaptive technical questions
                </div>
              </Link>

              <Link
                to="/chat"
                className="block p-3.5 rounded-xl bg-surface-800/40 border border-white/5 hover:border-emerald-500/30 transition-all"
              >
                <div className="text-[13px] font-medium text-white mb-1">
                  Ask AI Career Copilot
                </div>
                <div className="text-[11px] text-surface-400">
                  Get instant resume bullet advice and tips
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
