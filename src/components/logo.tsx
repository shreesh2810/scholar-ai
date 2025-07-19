import { BookOpenCheck } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 px-2">
      <BookOpenCheck className="w-8 h-8 text-sidebar-primary" />
      <h1 className="text-xl font-bold font-headline text-sidebar-foreground">ScholarAI</h1>
    </div>
  );
}
