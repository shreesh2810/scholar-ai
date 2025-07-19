'use server';

/**
 * @fileOverview Semantic literature search flow.
 *
 * - semanticLiteratureSearch - A function that performs semantic search for research papers.
 * - SemanticLiteratureSearchInput - The input type for the semanticLiteratureSearch function.
 * - SemanticLiteratureSearchOutput - The return type for the semanticLiteratureSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticLiteratureSearchInputSchema = z.object({
  query: z.string().describe('The research query to find similar papers.'),
});
export type SemanticLiteratureSearchInput = z.infer<typeof SemanticLiteratureSearchInputSchema>;

const SemanticLiteratureSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      title: z.string().describe('The title of the research paper.'),
      abstract: z.string().describe('A summary of the paper.'),
      url: z.string().describe('URL to the paper.'),
    })
  ).describe('A list of research papers that are semantically similar to the query.'),
});
export type SemanticLiteratureSearchOutput = z.infer<typeof SemanticLiteratureSearchOutputSchema>;

export async function semanticLiteratureSearch(input: SemanticLiteratureSearchInput): Promise<SemanticLiteratureSearchOutput> {
  return semanticLiteratureSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticLiteratureSearchPrompt',
  input: {schema: SemanticLiteratureSearchInputSchema},
  output: {schema: SemanticLiteratureSearchOutputSchema},
  prompt: `You are a research assistant helping users find relevant academic papers.

  Based on the user's query, find research papers that are semantically similar.
  Return a list of papers with their title, abstract, and URL.

  Query: {{{query}}}`,
});

const semanticLiteratureSearchFlow = ai.defineFlow(
  {
    name: 'semanticLiteratureSearchFlow',
    inputSchema: SemanticLiteratureSearchInputSchema,
    outputSchema: SemanticLiteratureSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
