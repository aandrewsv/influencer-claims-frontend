// src/services/api.ts
import axios from 'axios';
import { LeaderboardStats, InfluencerListItem } from '@/types/api';
import { InfluencerVerifyResponse } from '@/types/research.types';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const influencerService = {
  getStats: () => api.get<LeaderboardStats>('api/influencers/stats'),
  getList: () => api.get<InfluencerListItem[]>('api/influencers/list'),
  verify: (handle: string) => api.post<InfluencerVerifyResponse>('api/influencers/verify', { handle }),
};

export const researchService = {
  createTask: (data: {
    influencerId: number;
    timeRange: string;
    claimsCount: number;
    max_tokens: number;
    selectedJournals: string[];
    notes: string;
  }) => api.post('api/research/tasks', data),
};
