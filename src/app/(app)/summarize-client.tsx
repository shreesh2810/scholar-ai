"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Loader2, Bot, Lightbulb, TestTube2, ChevronsRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { summarizePaper, SummarizePaperOutput } from '@/ai/flows/summarize-paper';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  pdfUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function SummarizeClient() {
  const [analysis, setAnalysis] = useState<SummarizePaperOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdfUrl: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await summarizePaper({ pdfUrl: values.pdfUrl });
      setAnalysis(result);
    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please check the link or try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle className="font-headline">Analyze Paper from Link</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pdfUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDF URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://arxiv.org/pdf/1706.03762" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Generate Analysis'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || analysis) && (
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot />
              Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-4 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ) : analysis && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold font-headline">{analysis.title}</h2>
                        <p className="text-muted-foreground mt-2">{analysis.summary}</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5" />
                                    Key Findings
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-6 space-y-2">
                                    {analysis.keyFindings.map((finding, i) => <li key={i}>{finding}</li>)}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <TestTube2 className="w-5 h-5" />
                                    Methodology
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {analysis.methodology}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                 <div className="flex items-center gap-2">
                                    <ChevronsRight className="w-5 h-5" />
                                    Conclusion
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {analysis.conclusion}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
