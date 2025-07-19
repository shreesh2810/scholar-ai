import { PageHeader } from '@/components/page-header';
import { LiteratureSearchClient } from './literature-search-client';

export default function LiteratureSearchPage() {
  return (
    <>
      <PageHeader
        title="Literature Search"
        description="Find semantically similar research papers using a natural language query."
      />
      <LiteratureSearchClient />
    </>
  );
}
