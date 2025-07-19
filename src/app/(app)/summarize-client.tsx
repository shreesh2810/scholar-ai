"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloud, Loader2, FileText, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { summarizePaper, SummarizePaperOutput } from '@/ai/flows/summarize-paper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [summary, setSummary] = useState<SummarizePaperOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { setValue, watch } = form;
  const selectedFile = watch('pdfFile');

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const pdfDataUri = await fileToDataUri(values.pdfFile);
      const result = await summarizePaper({ pdfDataUri });
      setSummary(result);
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
      <Card>
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
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-accent/50 hover:bg-accent"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
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
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm">
                  <FileText className="w-5 h-5" />
                  <span>{selectedFile.name}</span>
                </div>
              )}
              <Button type="submit" disabled={isLoading || !selectedFile} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Summarizing...' : 'Generate Summary'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || summary) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot />
              Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="qna" disabled>Document Q&A</TabsTrigger>
                <TabsTrigger value="citations" disabled>Citations</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="prose prose-sm dark:prose-invert max-w-none mt-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <p>{summary?.summary}</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
