'use server';
/**
 * @fileOverview A flow to extract a direct PDF URL from a research paper's webpage.
 *
 * - extractPdfUrl - A function that finds and returns the direct PDF link.
 * - ExtractPdfUrlInput - The input type for the extractPdfUrl function.
 * - ExtractPdfUrlOutput - The return type for the extractPdfUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getPageContent } from '../tools/get-page-content';

const ExtractPdfUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the research paper page (e.g., arXiv, Google Scholar).'),
});
export type ExtractPdfUrlInput = z.infer<typeof ExtractPdfUrlInputSchema>;

const ExtractPdfUrlOutputSchema = z.object({
  pdfUrl: z.string().url().nullable().describe('The direct URL to the PDF file, or null if not found.'),
});
export type ExtractPdfUrlOutput = z.infer<typeof ExtractPdfUrlOutputSchema>;


export async function extractPdfUrl(input: ExtractPdfUrlInput): Promise<ExtractPdfUrlOutput> {
  return extractPdfUrlFlow(input);
}

const extractPdfUrlFlow = ai.defineFlow(
  {
    name: 'extractPdfUrlFlow',
    inputSchema: ExtractPdfUrlInputSchema,
    outputSchema: ExtractPdfUrlOutputSchema,
    tools: [getPageContent],
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `Given the URL, find the direct download link for the research paper's PDF. The URL to inspect is ${input.url}.`,
      tools: [getPageContent],
      output: {
        schema: ExtractPdfUrlOutputSchema,
      }
    });

    const toolRequest = llmResponse.toolRequests[0];
    if (toolRequest && toolRequest.tool === 'getPageContent') {
      const toolResponse = await toolRequest.run();
      const finalResponse = await ai.generate({
        prompt: `From the following text content, extract the absolute URL that directly links to the PDF file. The base URL is ${input.url}. The link should end with .pdf. If no such link is found, return null. Content: ${toolResponse}`,
         output: {
            schema: ExtractPdfUrlOutputSchema
         }
      });
      return finalResponse.output!;
    }

    return { pdfUrl: null };
  }
);
