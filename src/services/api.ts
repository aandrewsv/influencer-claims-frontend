// src/services/api.ts
import axios from 'axios';
import { LeaderboardStats, InfluencerListItem } from '@/types/api';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const influencerService = {
  getStats: () => api.get<LeaderboardStats>('api/influencers/stats'),
  getList: () => api.get<InfluencerListItem[]>('api/influencers/list'),
};