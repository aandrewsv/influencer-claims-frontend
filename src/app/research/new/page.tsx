// src/app/research/new/page.tsx
import ResearchTaskForm from '@/components/ResearchTaskForm';
import Providers from '@/app/providers';

export default function NewResearchPage() {
  return (
    <Providers>
      <ResearchTaskForm />
    </Providers>
  );
}