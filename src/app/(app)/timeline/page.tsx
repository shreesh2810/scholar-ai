import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TimelineEvent {
  id: number;
  icon: LucideIcon;
  iconClass: string;
  title: string;
  description: string;
  time: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    icon: Search,
    iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    title: "Searched for Literature",
    description: "Query: 'Impact of AI on climate change research'",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: FileText,
    iconClass: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    title: "Summarized Paper",
    description: "'Attention Is All You Need' by Vaswani et al.",
    time: "1 day ago",
  },
  {
    id: 3,
    icon: Search,
    iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    title: "Searched for Literature",
    description: "Query: 'Graph neural networks for drug discovery'",
    time: "3 days ago",
  },
  {
    id: 4,
    icon: FileText,
    iconClass: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    title: "Summarized Paper",
    description: "'Generative Adversarial Nets' by Goodfellow et al.",
    time: "5 days ago",
  },
];

export default function TimelinePage() {
  return (
    <>
      <PageHeader
        title="Research Timeline"
        description="A visual journey of your research activities and progress."
      />
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
            <div className="space-y-8">
              {timelineEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className={`w-12 h-12 rounded-full flex items-center justify-center ${event.iconClass}`}>
                        <Icon className="w-6 h-6" />
                      </span>
                    </div>
                    <div className="flex-grow pt-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="text-xs text-muted-foreground/80 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
