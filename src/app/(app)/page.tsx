import { PageHeader } from '@/components/page-header';
import { SummarizeClient } from './summarize-client';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Smart Summaries"
        description="Upload a research paper to get a structured summary."
      />
      <SummarizeClient />
    </>
  );
}
