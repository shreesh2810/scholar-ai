import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-paper.ts';
import '@/ai/flows/semantic-literature-search.ts';
import '@/ai/flows/extract-pdf-url.ts';
