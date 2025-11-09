/**
 * Scoring Service - Calculate confidence scores and assign badges
 * Based on data sources: GitHub, CV, LinkedIn, Web
 */

import { Skill } from '@/components/results/SkillCard';
import { BadgeType } from '@/components/results/SkillBadge';

interface SkillInput {
  name: string;
  category: string;
  sources: string[];
  evidence?: string[];
  confidence?: number;
}

interface ScoringWeights {
  github: number;
  cv: number;
  linkedin: number;
  web: number;
}

export class ScoringService {
  // Weights for each data source
  private weights: ScoringWeights = {
    github: 60,    // GitHub proof = highest weight
    cv: 20,        // CV declaration
    linkedin: 10,  // LinkedIn profile
    web: 10,       // Web search results
  };

  /**
   * Calculate confidence score based on sources
   */
  calculateScore(skill: SkillInput): number {
    // If confidence is already provided and valid, use it
    if (skill.confidence !== undefined && skill.confidence >= 0 && skill.confidence <= 100) {
      return skill.confidence;
    }

    let totalScore = 0;
    const sources = skill.sources || [];

    // Add score for each source present
    if (sources.includes('github')) {
      totalScore += this.weights.github;
      
      // Bonus if there's evidence from GitHub
      if (skill.evidence && skill.evidence.some(e => e.includes('repository') || e.includes('repo'))) {
        totalScore += 10; // Bonus for concrete repo evidence
      }
    }

    if (sources.includes('cv')) {
      totalScore += this.weights.cv;
    }

    if (sources.includes('linkedin')) {
      totalScore += this.weights.linkedin;
    }

    if (sources.includes('web')) {
      totalScore += this.weights.web;
    }

    // Cap at 100
    return Math.min(100, totalScore);
  }

  /**
   * Assign badge based on score and sources
   */
  assignBadge(skill: SkillInput, score: number): BadgeType {
    const hasGithub = skill.sources.includes('github');
    const hasCV = skill.sources.includes('cv');
    const hasMultipleSources = skill.sources.length >= 2;

    // 🟢 PROVEN: High score + GitHub proof
    if (score >= 70 && hasGithub) {
      return 'proven';
    }

    // 🟡 DECLARED: Medium score OR only CV/LinkedIn
    if (score >= 40 && score < 70) {
      return 'declared';
    }

    if (hasCV && !hasGithub && score >= 50) {
      return 'declared';
    }

    // 🟡 DECLARED: Multiple sources even if lower score
    if (hasMultipleSources && score >= 40) {
      return 'declared';
    }

    // 🔴 OVERSTATED: Low score or contradictions
    return 'overstated';
  }

  /**
   * Process and enrich a single skill
   */
  processSkill(skill: SkillInput): Skill {
    const score = this.calculateScore(skill);
    const badge = this.assignBadge(skill, score);

    return {
      name: skill.name,
      category: skill.category as any,
      confidence: score,
      sources: skill.sources,
      evidence: skill.evidence,
      badge,
    };
  }

  /**
   * Process multiple skills
   */
  processSkills(skills: SkillInput[]): Skill[] {
    return skills.map(skill => this.processSkill(skill));
  }

  /**
   * Get statistics about skills
   */
  getSkillsStats(skills: Skill[]) {
    const proven = skills.filter(s => s.badge === 'proven').length;
    const declared = skills.filter(s => s.badge === 'declared').length;
    const overstated = skills.filter(s => s.badge === 'overstated').length;

    const avgConfidence = skills.length > 0
      ? Math.round(skills.reduce((sum, s) => sum + s.confidence, 0) / skills.length)
      : 0;

    return {
      total: skills.length,
      proven,
      declared,
      overstated,
      avgConfidence,
      provenPercentage: skills.length > 0 ? Math.round((proven / skills.length) * 100) : 0,
    };
  }
}
