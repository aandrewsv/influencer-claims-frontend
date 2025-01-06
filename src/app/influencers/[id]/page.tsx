// src/app/influencers/[id]/page.tsx
import InfluencerDetail from '@/components/InfluencerDetail';
import Providers from '@/app/providers';

export default function InfluencerDetailPage() {
  return (
    <Providers>
      <InfluencerDetail />
    </Providers>
  );
}