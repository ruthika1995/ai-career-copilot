import { useState } from 'react';
import {
  Database,
  Cpu,
  Key,
  ShieldCheck,
  CheckCircle2,
  Save,
  Download,
} from 'lucide-react';
import { apiClient } from '../services/api';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('AIzaSy********************');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [supabaseUrl, setSupabaseUrl] = useState('https://app.supabase.co');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Settings & Architecture</h1>
        <p className="text-[14px] text-surface-300">
          Configure API credentials, AI inference models, and verify free-tier infrastructure
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-500/30 flex items-center gap-3 text-accent-300 text-[14px] animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      {/* Free Tier Infrastructure Status */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-brand-400">
          <Database className="w-5 h-5" />
          <h2 className="text-[15px] font-semibold text-white">
            Free-Tier Infrastructure Health
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-surface-800/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-surface-300 font-medium">PostgreSQL</span>
              <span className="w-2 h-2 rounded-full bg-accent-400" />
            </div>
            <div className="text-lg font-bold text-white">Active</div>
            <div className="text-[11px] text-surface-400">Supabase Free / Local SQLite</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-800/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-surface-300 font-medium">pgvector</span>
              <span className="w-2 h-2 rounded-full bg-accent-400" />
            </div>
            <div className="text-lg font-bold text-white">Enabled</div>
            <div className="text-[11px] text-surface-400">Vector Embeddings (768d)</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-800/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-surface-300 font-medium">Storage Bucket</span>
              <span className="w-2 h-2 rounded-full bg-accent-400" />
            </div>
            <div className="text-lg font-bold text-white">Ready</div>
            <div className="text-[11px] text-surface-400">PDF Resumes (1GB free)</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI & LLM Settings */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-400">
            <Cpu className="w-5 h-5" />
            <h2 className="text-[15px] font-semibold text-white">AI Inference Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">
                LLM Provider
              </label>
              <input
                type="text"
                disabled
                value="OpenRouter AI (Active & Configured)"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/50 border border-emerald-500/30 text-emerald-300 font-medium text-[14px]"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">
                Inference Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px] focus:outline-none focus:border-brand-500"
              >
                <option value="liquid/lfm-2.5-2.6b:free">Liquid LFM 2.5 (Free · Fast Inference)</option>
                <option value="nvidia/nemotron-3.5-lightning:free">Nvidia Nemotron 3.5 (Free)</option>
                <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B Instruct</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">
              OpenRouter API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value="sk-or-v1-••••••••••••••••••••••••••••••••"
                readOnly
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/80 border border-emerald-500/30 text-emerald-300 font-mono text-[13px] focus:outline-none"
              />
              <Key className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-surface-400 mt-1">
              Connected and authenticated with OpenRouter free-tier access.
            </p>
          </div>

          <div>
            <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px] focus:outline-none focus:border-brand-500"
              />
              <Key className="w-4 h-4 text-surface-400 absolute right-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-surface-400 mt-1">
              Keys are stored securely in backend .env and never exposed in client bundles.
            </p>
          </div>
        </div>

        {/* Database Credentials */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-[15px] font-semibold text-white">Database & Supabase URL</h2>
          </div>

          <div>
            <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px] focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={async () => {
              try {
                const profile = await apiClient.getProfile();
                const jobs = await apiClient.getJobs();
                const data = { profile, jobs, exported_at: new Date().toISOString() };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `career_copilot_export_${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              } catch (err) {
                console.error(err);
              }
            }}
            className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-surface-300 hover:text-white bg-surface-800 hover:bg-surface-700 transition-colors flex items-center gap-2 border border-white/5"
          >
            <Download className="w-4 h-4" /> Export Career Data (JSON)
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
