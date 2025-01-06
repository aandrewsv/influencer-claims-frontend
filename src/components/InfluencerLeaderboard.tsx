'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { influencerService } from '@/services/api';
import DefaultAvatar from './DefaultAvatar';

const LoadingState = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse space-y-8">
        {/* Title and subtitle skeleton */}
        <div>
          <div className="h-8 bg-gray-800 rounded w-96 mb-2" />
          <div className="h-4 bg-gray-800 rounded w-full max-w-2xl" />
        </div>
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-6 h-24" />
          ))}
        </div>
        
        {/* Table skeleton */}
        <div className="bg-gray-800/30 rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-gray-700 p-6">
              <div className="h-16 bg-gray-800/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-7xl mx-auto">
      <div className="bg-red-900/30 border border-red-500 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Unable to load influencer data</h3>
        <p className="text-gray-300">There was an error loading the leaderboard. Please try again later or contact support if the problem persists.</p>
      </div>
    </div>
  </div>
);

export default function InfluencerLeaderboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['influencer-stats'],
    queryFn: () => influencerService.getStats().then(res => res.data)
  });

  const { 
    data: influencers, 
    isLoading: listLoading, 
    error: listError 
  } = useQuery({
    queryKey: ['influencer-list'],
    queryFn: () => influencerService.getList().then(res => res.data)
  });

  const isLoading = statsLoading || listLoading;

  if (isLoading) {
    return <LoadingState />;
  }

  if (listError) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold">Influencer Trust Leaderboard</h1>
            <p className="text-gray-400 text-sm mt-1">
            Real-time rankings of health influencers based on scientific accuracy, credibility, and transparency. Updated daily using AI-powered analysis.
            </p>
          </div>
          <Link 
            href="/research/new"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            New Research
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-gray-800/50 rounded-lg p-6 flex items-start space-x-3">
            <UserGroupIcon className="w-12 h-12 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold">{stats?.totalInfluencers.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Active Influencers</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 flex items-start space-x-3">
            <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold">{stats?.totalClaims.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Claims Verified</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 flex items-start space-x-3">
            <ChartBarIcon className="w-12 h-12 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold">{(stats?.averageTrustScore ? stats?.averageTrustScore* 100 : 0)}%</p>
              <p className="text-gray-400 text-sm">Average Trust Score</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800/30 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">RANK</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">INFLUENCER</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">TRUST SCORE</th>
                <th className="text-center py-4 px-6 text-gray-400 font-medium">TREND</th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">FOLLOWERS</th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">VERIFIED CLAIMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {influencers?.map((inf, index) => (
                <tr key={inf.id} className="hover:bg-gray-800/30 transition-colors duration-150 cursor-pointer group">
                  <td className="py-4 px-6 font-medium relative">
                    <Link 
                      href={`/influencers/${inf.id}`}
                      className="absolute inset-0 w-[1000%] z-10"
                      aria-label={`View research for ${inf.mainName}`}
                    />
                    #{index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <DefaultAvatar />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{inf.mainName}</div>
                        <div className="text-gray-400 text-sm truncate max-w-md">
                          {inf.description}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {inf.contentTags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${
                      (inf.trustScore * 100) >= 90 ? 'text-green-400' :
                      (inf.trustScore * 100) >= 80 ? 'text-emerald-400' :
                      'text-yellow-400'
                    }`}>
                      {(inf.trustScore * 100)}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {inf.trend === 'up' ? (
                      <ArrowUpIcon className="w-5 h-5 text-green-500 inline-block" />
                    ) : (
                      <ArrowDownIcon className="w-5 h-5 text-red-500 inline-block" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-medium">
                    {(inf.totalFollowers >= 1000000
                      ? `${(inf.totalFollowers / 1000000).toFixed(1)}M`
                      : inf.totalFollowers >= 1000
                      ? `${(inf.totalFollowers / 1000).toFixed(1)}K`
                      : inf.totalFollowers).toString()}
                  </td>
                  <td className="py-4 px-6 text-right font-medium">
                    {inf.verifiedClaims}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
