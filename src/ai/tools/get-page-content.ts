'use server';

/**
 * @fileOverview A tool to fetch the text content of a webpage.
 * 
 * - getPageContent - A Genkit tool that retrieves text from a URL.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { JSDOM } from 'jsdom';

export const getPageContent = ai.defineTool(
  {
    name: 'getPageContent',
    description: 'Fetches the text content from a given URL. Strips all HTML tags.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to fetch the content from.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const response = await fetch(input.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      // Use JSDOM to parse HTML and extract text, which is safer than regex.
      const dom = new JSDOM(html);
      const reader = new dom.window.DOMParser();
      const doc = reader.parseFromString(dom.window.document.body.innerHTML, 'text/html');
      
      // Attempt to find a specific PDF link first
      const pdfLink = doc.querySelector('a[href$=".pdf"]');
      if (pdfLink) {
        let href = pdfLink.getAttribute('href') || '';
        // Ensure the URL is absolute
        try {
            return new URL(href, input.url).toString();
        } catch(e) {
            // if it's not a valid url, just fall through to text extraction
        }
      }

      return doc.body.textContent || '';

    } catch (error) {
      console.error('Failed to fetch page content:', error);
      return `Error fetching content from ${input.url}.`;
    }
  }
);
