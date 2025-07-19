import { BookOpenCheck } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 px-2">
      <BookOpenCheck className="w-8 h-8 text-primary" />
      <h1 className="text-xl font-bold font-headline">ScholarAI</h1>
    </div>
  );
}
