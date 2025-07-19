"use client";

import { BookOpen, FileText, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryTab } from './summary-tab';
import { SearchTab } from './search-tab';

const StatCard = ({ icon: Icon, title, value, description, color }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
);

export function DashboardClient() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={FileText}
          title="Papers Analyzed"
          value="12"
          description="Total documents processed"
          color="text-primary"
        />
        <StatCard
          icon={Bot}
          title="AI Summaries"
          value="8"
          description="Generated this month"
          color="text-green-500"
        />
        <StatCard
          icon={BookOpen}
          title="Literature Searches"
          value="34"
          description="Performed this month"
          color="text-amber-500"
        />
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Paper Summary</TabsTrigger>
          <TabsTrigger value="literature">Literature Search</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <SummaryTab />
        </TabsContent>
        <TabsContent value="literature">
          <SearchTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
