import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mic,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Award,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { mockInterview, mockJobs } from '../utils/mockData';
import { apiClient } from '../services/api';
import type { Interview, Job } from '../types';
import ScoreRing from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';

export default function InterviewPage() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || '1';
  const [selectedJob, setSelectedJob] = useState<Job>(mockJobs[0]);
  const [interviewState, setInterviewState] = useState<Interview>(mockInterview);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Custom interview config
  const [showConfig, setShowConfig] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedFocus, setSelectedFocus] = useState('Java + Spring Boot');

  useEffect(() => {
    const init = async () => {
      try {
        const [jobsList, latestInter] = await Promise.all([
          apiClient.getJobs(),
          apiClient.getLatestInterview(),
        ]);
        const matchedJob = jobsList.find((j) => j.id === jobId) || jobsList[0];
        if (matchedJob) setSelectedJob(matchedJob);
        if (latestInter) setInterviewState(latestInter);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [jobId]);

  const currentQ = interviewState.questions[currentIdx] || interviewState.questions[0];
  const hasAnswered = !!currentQ?.evaluation;

  const handleStartNewInterview = async () => {
    setIsGenerating(true);
    try {
      const created = await apiClient.createInterview(
        selectedJob.id,
        selectedDifficulty,
        selectedFocus
      );
      setInterviewState(created);
      setCurrentIdx(0);
      setUserAnswer('');
      setShowConfig(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    try {
      const updated = await apiClient.submitAnswer(
        interviewState.id,
        currentIdx,
        userAnswer
      );
      setInterviewState(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < interviewState.questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setUserAnswer(interviewState.questions[nextIdx]?.user_answer || '');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 mb-1">
            <Mic className="w-5 h-5" />
            <span className="text-[13px] font-semibold tracking-wide uppercase">
              Adaptive AI Mock Interviewer
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Technical Interview Simulation</h1>
          <p className="text-[14px] text-surface-300">
            Role: <span className="text-white font-medium">{selectedJob.title}</span> at{' '}
            <span className="text-white font-medium">{selectedJob.company}</span> · Focus:{' '}
            <span className="text-brand-300 font-medium">{interviewState.focus_area}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-surface-200 hover:text-white bg-surface-800/80 hover:bg-surface-700/80 border border-white/5 transition-all flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-accent-400" />
            Configure Session
          </button>

          <div className="glass-card px-4 py-2 flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-surface-400">Average Score</div>
              <div className="text-base font-bold text-brand-400">
                {interviewState.overall_score || 78}%
              </div>
            </div>
            <ScoreRing score={interviewState.overall_score || 78} size={42} strokeWidth={4} />
          </div>
        </div>
      </div>

      {/* Custom configuration modal / drawer */}
      {showConfig && (
        <div className="glass-card p-6 animate-scale-in border-accent-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400" /> Generate Adaptive Question Sequence
            </h3>
            <span className="text-xs text-surface-400">Gemini Interview Agent</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">
                Technical Focus Area
              </label>
              <select
                value={selectedFocus}
                onChange={(e) => setSelectedFocus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/10 text-white text-[13px] focus:outline-none focus:border-brand-500"
              >
                <option value="Java + Spring Boot">Java + Spring Boot (Backend Architecture)</option>
                <option value="Python + FastAPI + Docker">Python + FastAPI + Docker (Microservices)</option>
                <option value="React + TypeScript">React + TypeScript (Modern Frontend)</option>
                <option value="System Design & Scalability">System Design & High-Concurrency</option>
              </select>
            </div>

            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">
                Interview Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/10 text-white text-[13px] focus:outline-none focus:border-brand-500"
              >
                <option value="easy">Fresher / Junior (Core Fundamentals)</option>
                <option value="medium">Standard Mid-Level (Design & Implementation)</option>
                <option value="hard">Senior / Advanced (Concurrency & Edge Cases)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-2 text-[13px] text-surface-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleStartNewInterview}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-accent-600 hover:bg-accent-500 transition-all flex items-center gap-2 shadow-md shadow-accent-500/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Generating Questions...
                </>
              ) : (
                'Generate 3 New Questions'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Progress tracker */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {interviewState.questions.map((q, idx) => (
            <button
              key={q.id || idx}
              onClick={() => {
                setCurrentIdx(idx);
                setUserAnswer(q.user_answer || '');
              }}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
                idx === currentIdx
                  ? 'bg-brand-500 text-white shadow-glow'
                  : q.evaluation
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-surface-800/60 text-surface-400 hover:text-surface-200'
              }`}
            >
              {q.evaluation && <CheckCircle2 className="w-3.5 h-3.5" />}
              Question {idx + 1}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-surface-400 font-medium capitalize">
          Difficulty: <span className="text-accent-400">{currentQ?.difficulty_level || 'medium'}</span>
        </span>
      </div>

      {/* Main Question & Answer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Question Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-400 text-[13px] font-semibold">
              <Sparkles className="w-4 h-4" /> Interviewer Prompt ({currentIdx + 1} of {interviewState.questions.length})
            </div>
            <p className="text-[17px] font-medium text-white leading-relaxed">
              {currentQ?.question}
            </p>
          </div>

          {/* User Response Area */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-semibold text-white">Your Technical Answer</label>
              <span className="text-[12px] text-surface-400">Explain your approach and trade-offs</span>
            </div>

            <textarea
              rows={6}
              value={userAnswer || currentQ?.user_answer || ''}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="State your answer clearly: mention design patterns, exception handling, data structures, and trade-offs..."
              className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-white/10 
                text-white text-[14px] placeholder:text-surface-400
                focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-y"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setUserAnswer('')}
                className="text-[13px] text-surface-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Answer
              </button>

              <button
                type="button"
                disabled={isEvaluating || !userAnswer.trim()}
                onClick={handleSubmitAnswer}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white 
                  bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 
                  transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI Evaluating with Rubric...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Evaluate My Answer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Evaluation & Scoring Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-accent-400">
                <Award className="w-5 h-5" />
                <h3 className="text-[15px] font-semibold text-white">Rubric Evaluation</h3>
              </div>
              {hasAnswered && currentQ.evaluation && (
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-accent-500/10 text-accent-400 border border-accent-500/20">
                  {currentQ.evaluation.overall}/10 Score
                </span>
              )}
            </div>

            {hasAnswered && currentQ.evaluation ? (
              <div className="space-y-4 animate-scale-in">
                <div className="space-y-3">
                  <ProgressBar
                    label="Technical Accuracy"
                    value={currentQ.evaluation.technical_accuracy * 10}
                  />
                  <ProgressBar
                    label="Clarity & Articulation"
                    value={currentQ.evaluation.clarity * 10}
                  />
                  <ProgressBar
                    label="Technical Depth"
                    value={currentQ.evaluation.depth * 10}
                  />
                  <ProgressBar
                    label="Communication"
                    value={currentQ.evaluation.communication * 10}
                  />
                </div>

                <div className="p-4 rounded-xl bg-surface-800/40 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-brand-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Actionable Feedback
                  </div>
                  <p className="text-[13px] text-surface-200 leading-relaxed">
                    {currentQ.evaluation.feedback}
                  </p>
                </div>

                {currentIdx < interviewState.questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white 
                      bg-surface-800 hover:bg-surface-700 border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-surface-500 mx-auto" />
                <p className="text-[13px] text-surface-400">
                  Submit your technical answer to receive real-time scores and constructive feedback.
                </p>
              </div>
            )}
          </div>

          {/* Interview tips */}
          <div className="glass-card p-5 space-y-3 bg-brand-950/20 border-brand-500/20">
            <div className="flex items-center gap-2 text-brand-400 text-[13px] font-semibold">
              <TrendingUp className="w-4 h-4" /> Pro Tip for Freshers
            </div>
            <p className="text-[12px] text-surface-300 leading-relaxed">
              Use the <strong>STAR method</strong> (Situation, Task, Action, Result) when discussing
              past projects. Highlight what <em>you</em> individually wrote and debugged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
