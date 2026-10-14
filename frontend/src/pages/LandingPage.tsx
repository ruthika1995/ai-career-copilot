import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Target, Brain, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">AI Career Copilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-[14px] text-surface-200 hover:text-white transition-colors px-4 py-2"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="text-[14px] font-medium text-white bg-brand-600 hover:bg-brand-500 
              px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-500/8 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-[13px] text-brand-300 font-medium">AI-Powered Career Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            <span className="text-white">Your AI-Powered</span>
            <br />
            <span className="gradient-text">Career Copilot</span>
          </h1>

          <p className="text-lg text-surface-200 mb-10 max-w-xl mx-auto leading-relaxed">
            Upload your resume, paste a job description, and get an AI-generated assessment of your fit — 
            complete with skill matching, gap analysis, and a personalized learning roadmap.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold 
                text-white bg-gradient-to-r from-brand-600 to-brand-500 
                hover:from-brand-500 hover:to-brand-400 
                transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40
                hover:-translate-y-0.5"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-medium 
                text-surface-100 border border-white/10 hover:border-white/20 hover:bg-white/5
                transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Everything you need to land your dream role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            <FeatureCard
              icon={Target}
              title="Smart Job Matching"
              description="Multi-layer skill matching with exact, semantic, and evidence-backed scoring. Not just a number — an explainable assessment."
            />
            <FeatureCard
              icon={Brain}
              title="AI Interviewer"
              description="Practice with an adaptive AI interviewer that adjusts difficulty based on your performance and gives detailed feedback."
            />
            <FeatureCard
              icon={Shield}
              title="Career Intelligence"
              description="Personalized learning roadmaps, resume optimization, and RAG-powered career guidance grounded in real knowledge."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-white/5 text-center">
        <p className="text-[13px] text-surface-400">
          Built with React, FastAPI, PostgreSQL & Gemini AI
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Target;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card p-6 group">
      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 
        group-hover:bg-brand-500/20 transition-colors">
        <Icon className="w-5 h-5 text-brand-400" />
      </div>
      <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
      <p className="text-[13px] text-surface-300 leading-relaxed">{description}</p>
    </div>
  );
}
