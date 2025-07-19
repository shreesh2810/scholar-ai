'use server';

/**
 * @fileOverview A research paper summarization AI agent.
 *
 * - summarizePaper - A function that handles the paper summarization process.
 * - SummarizePaperInput - The input type for the summarizePaper function.
 * - SummarizePaperOutput - The return type for the summarizePaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePaperInputSchema = z.object({
  pdfUrl: z.string().url().describe('A URL to a research paper in PDF format.'),
});
export type SummarizePaperInput = z.infer<typeof SummarizePaperInputSchema>;

const SummarizePaperOutputSchema = z.object({
  title: z.string().describe('The title of the paper.'),
  summary: z.string().describe('A one-paragraph summary of the paper.'),
  keyFindings: z.array(z.string()).describe('A list of key findings from the paper.'),
  methodology: z.string().describe('A summary of the methodology used in the paper.'),
  conclusion: z.string().describe('The conclusion of the paper.'),
});
export type SummarizePaperOutput = z.infer<typeof SummarizePaperOutputSchema>;

export async function summarizePaper(input: SummarizePaperInput): Promise<SummarizePaperOutput> {
  return summarizePaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePaperPrompt',
  input: {schema: SummarizePaperInputSchema},
  output: {schema: SummarizePaperOutputSchema},
  prompt: `You are an expert research assistant. You will analyze the provided research paper and extract key information.

Provide the title of the paper.
Provide a concise, single-paragraph summary.
List the key findings as an array of strings.
Summarize the methodology.
Provide the conclusion of the paper.

Paper: {{media url=pdfUrl}}`,
});

const summarizePaperFlow = ai.defineFlow(
  {
    name: 'summarizePaperFlow',
    inputSchema: SummarizePaperInputSchema,
    outputSchema: SummarizePaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
