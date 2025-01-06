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
  
  