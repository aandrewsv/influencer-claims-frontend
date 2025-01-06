// src/types/api.ts
export interface LeaderboardStats {
    totalInfluencers: number;
    totalClaims: number;
    averageTrustScore: number;
  }
  
  export interface InfluencerListItem {
    id: number;
    mainName: string;
    description: string;
    contentTags: string[]; // Will show first 3
    trustScore: number;
    trend: 'up' | 'down';
    totalFollowers: number;
    verifiedClaims: number;
  }
  
  export interface ApiError {
    message: string;
    details?: string;
    error: string;
    statusCode: number;
  }
  // src/types/api.ts
// ... (tipos existentes)

export interface ResearchTaskAnalysisResults {
  influencer: string;
  requestedClaimsCount: number;
  totalClaimsFound: number;
  uniqueClaimsCount: number;
  claims: Array<{
    text: string;
    category: string;
    source: string;
    verificationStatus: 'Verified' | 'Questioned' | 'Debunked';
    journalsVerified: string[];
    journalsQuestioned: string[];
    journalsDebunked: string[];
    score: number;
  }>;
}

export interface ResearchTask {
  id: number;
  timeRange: string;
  claimsCount: number;
  selectedJournals: string[];
  notes: string;
  analysisResults: string | null;
  createdAt: string;
}

export interface Claim {
  id: number;
  text: string;
  category: string;
  source: string;
  verificationStatus: 'Verified' | 'Questionable' | 'Debunked';
  journalsVerified: string[];
  journalsQuestioned: string[];
  journalsDebunked: string[];
  score: number;
  firstDetectedAt: string;
}

export interface InfluencerDetail {
  id: number;
  handle: string;
  mainName: string;
  description: string;
  aliases: string[];
  contentTags: string[];
  yearlyRevenueUsd: number;
  totalFollowers: number;
  lastVerified: string;
  claims: Claim[];
  trustScore: number;
}
