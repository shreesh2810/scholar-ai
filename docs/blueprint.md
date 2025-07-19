# **App Name**: ScholarAI

## Core Features:

- Smart Summaries: Paper Summarization: Upload a PDF and receive a structured summary using local LLM via Ollama or OpenAI as tool. 
- Literature Search: Semantic Search: Find semantically similar research papers using vector embeddings. Users will provide the query and can receive the answers by Ollama or OpenAI as tool.
- Document Q&A: Interactive Q&A: Pose questions regarding the uploaded documents.
- Deployment: Deployment: Use Vercel/Netlify (frontend) and Railway/Render (backend) for deployment
- Citation Management: Auto-generate citations for the processed papers in various formats. Users can save in Supabase or local storage
- Research Timeline: Track the research process visually to follow progress. 
- Project Architeture: The whole project use: React with modern UI (shadcn/ui components), FastAPI with async support, Vector Database with Pinecone or Qdrant and Document Processing with LangChain and PyPDF2/pymupdf.

## Style Guidelines:

- Primary color: Slate blue (#778899) evokes a sense of calm, neutrality, and trustworthiness, suitable for academic research tools.
- Background color: Off-white (#F5F5F5) offers a clean, unobtrusive backdrop, keeping the focus on content and usability.
- Accent color: Soft lavender (#E6E6FA) can provide gentle visual cues and highlight key interactive elements.
- Body font: 'Inter' (sans-serif) for clear, readable paragraphs of text
- Headline font: 'Space Grotesk' (sans-serif) for brief titles.
- Use subtle, professional icons to represent document types, actions, and categories. Choose icons with rounded edges to maintain a consistent visual tone.
- Implement a clean and structured layout with generous whitespace to ensure readability and focus.