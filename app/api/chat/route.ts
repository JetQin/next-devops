import { CoreMessage, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  });

  const result = await streamText({
    model: groq('llama3-8b-8192'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}