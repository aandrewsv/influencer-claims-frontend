'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChartBarIcon,
  BanknotesIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { influencerService } from '@/services/api';
import DefaultAvatar from './DefaultAvatar';
import { InfluencerDetail as InfluencerDetailType } from '@/types/api';

type Tab = 'claims' | 'products' | 'monetization';

const JournalBadge = ({ name, type }: { name: string; type: 'verified' | 'questioned' | 'debunked' | 'none' }) => {
  const colors = {
    verified: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30',
    questioned: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
    debunked: 'bg-red-900/30 text-red-400 border-red-500/30',
    none: 'bg-gray-800/30 text-gray-400 border-gray-700/30'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${colors[type]}`}>
      {name}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
  <div className="bg-gray-800/50 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-emerald-500 mt-1" />
      <div>
        <div className="text-2xl font-semibold mb-1">{value}</div>
        <div className="text-sm text-gray-400">{title}</div>
      </div>
    </div>
  </div>
);

const formatMoney = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(1)}K`;
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M+`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K+`;
  }
  return num.toString();
};

export default function InfluencerDetail() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('claims');
  
  const { data: influencer, isLoading, error } = useQuery<InfluencerDetailType>({
    queryKey: ['influencer', params.id],
    queryFn: () => influencerService.getById(Number(params.id)).then(res => res.data)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-32 bg-gray-800 rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Error loading influencer data</h3>
            <p>Unable to load influencer details. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'claims', label: 'Claims Analysis' },
    { id: 'products', label: 'Recommended Products' },
    { id: 'monetization', label: 'Monetization' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium rounded-md text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="bg-gray-800/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
              <DefaultAvatar />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{influencer.mainName}</h1>
              <p className="text-gray-400 mb-4 max-w-3xl">{influencer.description}</p>
              <div className="flex flex-wrap gap-2">
                {influencer.contentTags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Trust Score"
            value={`${Math.round(influencer.trustScore * 100) || 0}%`}
            icon={ChartBarIcon}
          />
          <StatCard
            title="Yearly Revenue"
            value={formatMoney(influencer.yearlyRevenueUsd)}
            icon={BanknotesIcon}
          />
          <StatCard
            title="Verified Claims"
            value={influencer.claims.filter(c => c.verificationStatus === 'Verified').length.toString()}
            icon={CheckCircleIcon}
          />
          <StatCard
            title="Followers"
            value={formatNumber(influencer.totalFollowers)}
            icon={UsersIcon}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-800 mb-6">
          <nav className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'claims' && (
            <div className="space-y-4">
              {influencer.claims.map((claim) => (
                <div key={claim.id} className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      claim.verificationStatus === 'Verified' 
                        ? 'bg-emerald-900/30 text-emerald-400' 
                        : claim.verificationStatus === 'Questionable'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {claim.verificationStatus}
                    </span>
                    <span className="text-sm text-gray-400">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      {new Date(claim.firstDetectedAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-400">{claim.category}</span>
                    <span className="text-sm text-gray-400 flex items-center ml-auto">
                      <StarIcon className="w-4 h-4 inline mr-1" />
                      {Math.round(claim.score * 100)}% score
                    </span>
                  </div>
                  <p className="text-gray-200">{claim.text}</p>
                  <div className="mt-2 text-sm text-gray-400">{claim.source}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...new Set([
                      ...claim.journalsVerified,
                      ...claim.journalsQuestioned,
                      ...claim.journalsDebunked
                    ])].map(journal => {
                      let type: 'verified' | 'questioned' | 'debunked' | 'none' = 'none';
                      if (claim.journalsVerified.includes(journal)) type = 'verified';
                      else if (claim.journalsQuestioned.includes(journal)) type = 'questioned';
                      else if (claim.journalsDebunked.includes(journal)) type = 'debunked';
                      return <JournalBadge key={journal} name={journal} type={type} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'products' && (
            <div className="bg-gray-800/30 rounded-lg p-6 text-center">
              <p className="text-gray-400">No recommended products available</p>
            </div>
          )}
          {activeTab === 'monetization' && (
            <div className="bg-gray-800/30 rounded-lg p-6 text-center">
              <p className="text-gray-400">Monetization data is not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
