"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloud, Loader2, FileText, Bot, Lightbulb, TestTube2, ChevronsRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { summarizePaper, SummarizePaperOutput } from '@/ai/flows/summarize-paper';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  pdfFile: z.instanceof(File).refine(file => file.type === 'application/pdf', 'Only PDF files are accepted.'),
});

type FormValues = z.infer<typeof formSchema>;

async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SummarizeClient() {
  const [analysis, setAnalysis] = useState<SummarizePaperOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { setValue, watch } = form;
  const selectedFile = watch('pdfFile');

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const pdfDataUri = await fileToDataUri(values.pdfFile);
      const result = await summarizePaper({ pdfDataUri });
      setAnalysis(result);
    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
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
          <CardTitle className="font-headline">Upload Paper</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pdfFile"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center items-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PDF only (max 10MB)</p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setValue('pdfFile', e.target.files[0], { shouldValidate: true });
                              }
                            }}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedFile && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>{selectedFile.name}</span>
                </div>
              )}
              <Button type="submit" disabled={isLoading || !selectedFile} className="w-full sm:w-auto">
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
