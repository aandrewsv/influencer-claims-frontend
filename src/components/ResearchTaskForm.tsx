'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, BeakerIcon, ListBulletIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { influencerService, researchService } from '@/services/api';
import type { InfluencerVerifyResponse } from '@/types/research.types';
import type { ApiError } from '@/types/api';

const timeRangeOptions = [
  { value: 'last-week', label: 'Last Week' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'last-year', label: 'Last Year' },
  { value: 'all', label: 'All Time' },
] as const;

const journals = [
  'PubMed Central',
  'Nature',
  'Science',
  'Cell',
  'The Lancet',
  'JAMA Network',
  'New England Journal of Medicine'
] as const;

interface VerificationStepProps {
  onVerified: (influencer: InfluencerVerifyResponse) => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ onVerified }) => {
  const [handle, setHandle] = useState('');
  
  const {
    mutate: verifyInfluencer,
    isPending,
    error: verifyError,
    reset
  } = useMutation({
    mutationFn: () => influencerService.verify(handle),
    onSuccess: (response) => {
      onVerified(response.data);
    }
  });

  const errorMessage = verifyError
    ? verifyError instanceof AxiosError
      ? verifyError.response?.status === 404
        ? verifyError.response.data.message
        : 'An unexpected error occurred. Please try again later.'
      : 'An unexpected error occurred. Please try again later.'
    : '';

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="handle" className="text-sm font-medium text-gray-300">
          Influencer Name or Handle
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                if (verifyError) reset();
              }}
              placeholder="Enter influencer name..."
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        placeholder:text-gray-500"
            />
            {errorMessage && (
              <p className="mt-2 text-sm text-red-400">{errorMessage}</p>
            )}
          </div>
          <button
            onClick={() => verifyInfluencer()}
            disabled={!handle.trim() || isPending}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium
                     hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed
                     flex items-center gap-2 min-w-[120px] justify-center"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                Verify
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface VerifiedInfluencerProps {
  influencer: InfluencerVerifyResponse;
  onReset: () => void;
}

const VerifiedInfluencer: React.FC<VerifiedInfluencerProps> = ({ influencer, onReset }) => (
  <div className="bg-gray-800/30 rounded-lg p-4 flex items-start gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <CheckIcon className="w-5 h-5 text-emerald-500" />
        <h3 className="font-medium text-lg">{influencer.mainName}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-2">{influencer.description}</p>
      <div className="flex flex-wrap gap-2">
        {influencer.contentTags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
    <button
      onClick={onReset}
      className="text-gray-400 hover:text-white"
    >
      Change
    </button>
  </div>
);

interface ResearchFormData {
  timeRange: string;
  claimsCount: number;
  max_tokens: number;
  selectedJournals: string[];
  notes: string;
}

export default function ResearchTaskForm() {
  const router = useRouter();
  const [verifiedInfluencer, setVerifiedInfluencer] = useState<InfluencerVerifyResponse | null>(null);
  const [formData, setFormData] = useState<ResearchFormData>({
    timeRange: 'last-month',
    claimsCount: 50,
    max_tokens: 2048,
    selectedJournals: ['PubMed Central', 'Nature'],
    notes: ''
  });

  const { 
    mutate: createTask, 
    isPending: isSubmitting,
    error: submitError 
  } = useMutation({
    mutationFn: () => {
      if (!verifiedInfluencer) throw new Error('No influencer selected');
      return researchService.createTask({
        influencerId: verifiedInfluencer.id,
        ...formData
      });
    },
    onSuccess: () => {
      router.push(`/research/${verifiedInfluencer?.id}`);
    }
  });

  const errorDetails = submitError instanceof AxiosError 
    ? (submitError.response?.data as ApiError)?.details
    : undefined;

  const errorMessage = submitError instanceof AxiosError
    ? submitError.response?.data?.message || 'An unexpected error occurred'
    : submitError instanceof Error
      ? submitError.message
      : 'An unexpected error occurred';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <BeakerIcon className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-bold">Research Configuration</h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800/30 rounded-lg p-6">
          <div className="max-w-2xl space-y-8">
            {/* Step 1: Verify Influencer */}
            <div>
              <h2 className="text-lg font-medium mb-4">Step 1: Verify Influencer</h2>
              {verifiedInfluencer ? (
                <VerifiedInfluencer
                  influencer={verifiedInfluencer}
                  onReset={() => setVerifiedInfluencer(null)}
                />
              ) : (
                <VerificationStep
                  onVerified={setVerifiedInfluencer}
                />
              )}
            </div>

            {/* Step 2: Configure Research */}
            {verifiedInfluencer && (
              <div>
                <h2 className="text-lg font-medium mb-4">Step 2: Configure Research</h2>
                <div className="space-y-6">
                  {/* Time Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {timeRangeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({...prev, timeRange: option.value}))}
                          className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2
                            ${formData.timeRange === option.value 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                        >
                          <ClockIcon className="w-4 h-4" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Claims Count */}
                  <div>
                    <label htmlFor="claimsCount" className="block text-sm font-medium text-gray-300 mb-2">
                      Claims to Analyze
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        id="claimsCount"
                        value={formData.claimsCount}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          claimsCount: Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
                        }))}
                        className="w-32 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg"
                        min="1"
                        max="100"
                      />
                      <span className="text-sm text-gray-400">Recommended: less than 100 claims</span>
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div>
                    <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-300 mb-2">
                      Max Tokens (API Limit)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        id="max_tokens"
                        value={formData.max_tokens}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          max_tokens: Math.max(1024, parseInt(e.target.value) || 1024)
                        }))}
                        className="w-32 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg"
                        min="1024"
                        step="1024"
                      />
                      <span className="text-sm text-gray-400">Recommended: 2048-4096 tokens</span>
                    </div>
                  </div>

                  {/* Scientific Journals */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Scientific Journals</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {journals.map((journal) => (
                        <label key={journal} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                          <input
                            type="checkbox"
                            checked={formData.selectedJournals.includes(journal)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  selectedJournals: [...prev.selectedJournals, journal]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  selectedJournals: prev.selectedJournals.filter(j => j !== journal)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-emerald-600 rounded border-gray-700 bg-gray-800
                                     focus:ring-emerald-500 focus:ring-offset-gray-900"
                          />
                          <span>{journal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                      Notes for Research Assistant
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      placeholder="Add any specific instructions or focus areas..."
                    />
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                      <p className="text-red-400 font-medium">{errorMessage}</p>
                      {errorDetails && (
                        <p className="mt-2 text-sm text-gray-300 whitespace-pre-line">{errorDetails}</p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={() => createTask()}
                    disabled={isSubmitting || formData.selectedJournals.length === 0}
                    className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium
                             hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ListBulletIcon className="w-5 h-5" />
                        Start Research
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
