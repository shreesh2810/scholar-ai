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
  pdfDataUri: z
    .string()
    .describe(
      "A research paper in PDF format, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizePaperInput = z.infer<typeof SummarizePaperInputSchema>;

const SummarizePaperOutputSchema = z.object({
  summary: z.string().describe('A structured summary of the research paper.'),
});
export type SummarizePaperOutput = z.infer<typeof SummarizePaperOutputSchema>;

export async function summarizePaper(input: SummarizePaperInput): Promise<SummarizePaperOutput> {
  return summarizePaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePaperPrompt',
  input: {schema: SummarizePaperInputSchema},
  output: {schema: SummarizePaperOutputSchema},
  prompt: `You are an expert research assistant. You will summarize the key points of the research paper provided.

Paper: {{media url=pdfDataUri}}`,
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
