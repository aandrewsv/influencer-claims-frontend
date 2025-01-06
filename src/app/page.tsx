// src/app/page.tsx
import InfluencerLeaderboard from '@/components/InfluencerLeaderboard';
import Providers from './providers';

export default function Home() {
  return (
    <Providers>
      <InfluencerLeaderboard />
    </Providers>
  );
}