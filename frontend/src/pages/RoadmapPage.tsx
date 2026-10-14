import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  CheckCircle2,
  Circle,
  Code2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { mockRoadmap, mockJobs } from '../utils/mockData';
import { apiClient } from '../services/api';
import type { Job, LearningRoadmap } from '../types';
import ProgressBar from '../components/ui/ProgressBar';

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || '1';
  const [selectedJob, setSelectedJob] = useState<Job>(mockJobs.find((j) => j.id === jobId) || mockJobs[0]);
  const [roadmap, setRoadmap] = useState<LearningRoadmap>(mockRoadmap);

  const [completedSubtopics, setCompletedSubtopics] = useState<Record<string, boolean>>({
    'OOP Concepts': true,
    'Collections Framework': true,
  });

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        const [jobsList, rMap] = await Promise.all([
          apiClient.getJobs(),
          apiClient.getRoadmap(jobId),
        ]);
        const found = jobsList.find((j) => j.id === jobId);
        if (found) setSelectedJob(found);
        if (rMap) setRoadmap(rMap);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoadmapData();
  }, [jobId]);

  const toggleSubtopic = (name: string) => {
    setCompletedSubtopics((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Calculate overall progress
  let totalSubtopics = 0;
  let completedCount = 0;
  roadmap.weeks.forEach((w) => {
    w.topics.forEach((t) => {
      t.subtopics.forEach((s) => {
        totalSubtopics++;
        if (completedSubtopics[s]) completedCount++;
      });
    });
  });

  const progressPercent = Math.round((completedCount / (totalSubtopics || 1)) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-400 mb-1">
            <Compass className="w-5 h-5" />
            <span className="text-[13px] font-semibold tracking-wide uppercase">
              AI Growth Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Targeted Learning Roadmap</h1>
          <p className="text-[14px] text-surface-300">
            Tailored curriculum to bridge critical skill gaps for{' '}
            <span className="text-white font-medium">{selectedJob.title}</span> at{' '}
            <span className="text-white font-medium">{selectedJob.company}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass-card px-5 py-3 flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-surface-400 font-medium">Roadmap Progress</div>
              <div className="text-lg font-bold text-accent-400">{progressPercent}% Done</div>
            </div>
            <div className="w-16">
              <ProgressBar value={progressPercent} />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="glass-card p-6 bg-gradient-to-r from-accent-950/30 to-surface-900 border-accent-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-accent-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">
              4-Week Fast-Track Sprint Plan
            </h3>
            <p className="text-[13px] text-surface-300">
              Generated via Gemini reasoning over the exact missing requirements in your profile.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/interview?jobId=${selectedJob.id}`}
            className="px-4 py-2 rounded-xl text-[13px] font-medium text-white bg-accent-600 hover:bg-accent-500 transition-all flex items-center gap-2"
          >
            Practice Interview <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Timeline of Weeks */}
      <div className="space-y-6">
        {roadmap.weeks.map((week) => (
          <div key={week.week} className="glass-card p-6 transition-all hover:border-white/10">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg text-[12px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  WEEK {week.week}
                </span>
                <h2 className="text-lg font-semibold text-white">{week.title}</h2>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-surface-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Estimated 6-8 hrs/week</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modules list */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-surface-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-400" /> Core Modules
                </h3>
                <div className="space-y-3">
                  {week.topics.map((topic, tidx) => (
                    <div
                      key={tidx}
                      className="p-3.5 rounded-xl bg-surface-800/40 border border-white/5 space-y-2"
                    >
                      <div className="text-[14px] font-medium text-white">{topic.name}</div>
                      <div className="space-y-1.5 pl-1">
                        {topic.subtopics.map((sub, sidx) => {
                          const isDone = !!completedSubtopics[sub];
                          return (
                            <button
                              key={sidx}
                              onClick={() => toggleSubtopic(sub)}
                              className="flex items-center gap-2.5 text-[13px] text-left w-full hover:text-white transition-colors group"
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-accent-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-surface-500 group-hover:text-surface-300 shrink-0" />
                              )}
                              <span
                                className={
                                  isDone ? 'line-through text-surface-400' : 'text-surface-200'
                                }
                              >
                                {sub}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capstone Project / Milestones */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-surface-400 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accent-400" /> Milestone Project
                </h3>
                {week.project ? (
                  <div className="p-4 rounded-xl bg-accent-500/5 border border-accent-500/20 space-y-3 h-[calc(100%-2rem)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-accent-400 text-[13px] font-medium mb-1">
                        <Award className="w-4 h-4" /> Weekly Capstone Challenge
                      </div>
                      <p className="text-[13px] text-surface-200 leading-relaxed">{week.project}</p>
                    </div>
                    <div className="pt-3 border-t border-accent-500/10 flex items-center justify-between">
                      <span className="text-[12px] text-surface-400">Verifiable artifact</span>
                      <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-accent-500/20 text-accent-300 hover:bg-accent-500/30 transition-all">
                        Mark as Built
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-surface-800/20 border border-white/5 text-[13px] text-surface-400 flex items-center justify-center h-[calc(100%-2rem)] text-center">
                    Review theory and execute automated mini-exercises
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
