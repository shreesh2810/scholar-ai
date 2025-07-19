"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { semanticLiteratureSearch, SemanticLiteratureSearchOutput } from '@/ai/flows/semantic-literature-search';
import { ExternalLink, Loader2, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  query: z.string().min(10, 'Query must be at least 10 characters long.'),
});

type FormValues = z.infer<typeof formSchema>;

export function SearchTab() {
  const [results, setResults] = useState<SemanticLiteratureSearchOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResults(null);
    try {
      const searchResults = await semanticLiteratureSearch({ query: values.query });
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Error',
        description: 'Failed to perform search. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkeletons = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="interactive-card">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle className="font-headline">Semantic Literature Search</CardTitle>
          <CardDescription>Find semantically similar research papers using a natural language query.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="e.g., 'advancements in transformer architectures for NLP'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Search
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && renderSkeletons()}

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-headline font-semibold">
            Found {results.results.length} related papers
          </h2>
          {results.results.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {results.results.map((paper, index) => (
                <Card key={index} className="flex flex-col interactive-card">
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">{paper.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{paper.abstract}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" disabled>
                      <Quote className="mr-2 h-4 w-4" />
                      Cite
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        Read Paper <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 interactive-card">
              <CardContent>
                <p>No results found. Try a different query.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
