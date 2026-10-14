import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return Math.round(score).toString();
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-success-400';
  if (score >= 70) return 'text-brand-400';
  if (score >= 50) return 'text-warning-400';
  return 'text-danger-400';
}

export function getScoreGradient(score: number): string {
  if (score >= 85) return 'from-success-500 to-success-400';
  if (score >= 70) return 'from-brand-500 to-brand-400';
  if (score >= 50) return 'from-warning-500 to-warning-400';
  return 'from-danger-500 to-danger-400';
}

export function getMatchLabel(score: number): string {
  if (score >= 85) return 'Excellent Match';
  if (score >= 70) return 'Good Match';
  if (score >= 50) return 'Moderate Match';
  return 'Low Match';
}
