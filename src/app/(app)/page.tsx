import { PageHeader } from '@/components/page-header';
import { DashboardClient } from './dashboard-client';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your AI-powered academic paper analysis hub."
      />
      <DashboardClient />
    </>
  );
}
