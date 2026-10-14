import { useState, useEffect } from 'react';
import {
  Code2,
  Globe,
  ExternalLink,
  MapPin,
  Edit3,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import SkillBadge from '../components/ui/SkillBadge';
import { mockProfile, mockSkills } from '../utils/mockData';
import { apiClient } from '../services/api';
import type { Profile } from '../types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [degree, setDegree] = useState(profile.education[0]?.degree || 'B.Tech');
  const [field, setField] = useState(profile.education[0]?.field || 'Information Technology');
  const [institution, setInstitution] = useState(profile.education[0]?.institution || 'Anna University');
  const [githubUrl, setGithubUrl] = useState(profile.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url || '');
  const [locations, setLocations] = useState(profile.career_preferences?.preferred_locations?.join(', ') || 'Bangalore, Remote');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const p = await apiClient.getProfile();
        if (p) {
          setProfile(p);
          setName(p.name);
          if (p.education && p.education[0]) {
            setDegree(p.education[0].degree);
            setField(p.education[0].field);
            setInstitution(p.education[0].institution);
          }
          setGithubUrl(p.github_url || '');
          setLinkedinUrl(p.linkedin_url || '');
          if (p.career_preferences?.preferred_locations) {
            setLocations(p.career_preferences.preferred_locations.join(', '));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEdu = [
      {
        degree,
        field,
        institution,
        graduation_year: profile.education[0]?.graduation_year || 2025,
      },
    ];

    const updatedPreferences = {
      ...profile.career_preferences,
      preferred_locations: locations.split(',').map((l) => l.trim()),
    };

    const updatedData: Partial<Profile> = {
      name,
      education: updatedEdu,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      career_preferences: updatedPreferences,
    };

    try {
      const res = await apiClient.updateProfile(updatedData);
      setProfile({ ...profile, ...res });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      setProfile({ ...profile, ...updatedData });
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">My Career Profile</h1>
          <p className="text-[14px] text-surface-300">
            Your verified career credentials, education, and portfolio
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold 
            text-brand-300 bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20 transition-all shadow-sm"
        >
          {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* Edit Profile Form Modal */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="glass-card p-6 border-brand-500/30 animate-scale-in space-y-4">
          <div className="flex items-center gap-2 text-brand-400 font-semibold text-[15px]">
            <Sparkles className="w-4 h-4" /> Edit Profile Credentials
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px]"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px]"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">Degree</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px]"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">Field of Study</label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px]"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">GitHub Profile URL</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px]"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2 rounded-xl bg-surface-800 border border-white/10 text-white text-[14px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-[13px] text-surface-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Profile header card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{profile.name}</h2>
            <p className="text-[14px] text-surface-300 mt-0.5">
              {profile.education[0]?.degree} in {profile.education[0]?.field} · {profile.education[0]?.institution}
            </p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-surface-300 hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-brand-400" />
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-surface-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
                  LinkedIn
                </a>
              )}
              <span className="inline-flex items-center gap-1.5 text-[13px] text-surface-300">
                <MapPin className="w-3.5 h-3.5 text-accent-400" />
                {profile.career_preferences?.preferred_locations?.join(', ') || 'Remote'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-[15px] font-semibold text-white">Identified Competencies</h2>
        <div className="flex flex-wrap gap-2">
          {mockSkills.map((s, idx) => (
            <SkillBadge key={idx} name={s.name} matched={true} matchType="exact" />
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-brand-400">
          <Code2 className="w-5 h-5" />
          <h2 className="text-[15px] font-semibold text-white">Verified Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.projects?.map((proj, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface-800/40 border border-white/5 space-y-2">
              <h3 className="text-[14px] font-semibold text-white">{proj.name}</h3>
              <p className="text-[12px] text-surface-300 leading-relaxed">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-700/60 text-surface-200 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
