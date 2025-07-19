import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold font-headline">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
