// src/types/research.types.ts
export interface InfluencerVerifyResponse {
    id: number;
    handle: string;
    mainName: string;
    description: string;
    aliases: string[];
    contentTags: string[];
    yearlyRevenueUsd: number;
    totalFollowers: number;
    lastVerified: string;
  }
  
  export interface ResearchTaskForm {
    influencerId: number;
    timeRange: 'week' | 'month' | 'year' | 'all';
    productsPerInfluencer: number;
    claimsToAnalyze: number;
    includeRevenueAnalysis: boolean;
    verifyWithJournals: boolean;
    selectedJournals: string[];
    notes?: string;
  }