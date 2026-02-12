
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmbedding = async (text: string) => {
  try {
    console.log(`[OpenAI] Generating embedding for text: "${text.substring(0, 50)}..."`);
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
      dimensions: 1536,
    });
    console.log('[OpenAI] Embedding generated successfully.');
    if (!response.data || !response.data[0]) {
      throw new Error('Failed to generate embedding: empty response data');
    }
    return response.data[0].embedding;
  } catch (error: any) {
    console.error('[OpenAI] Embedding error:', error.message);
    throw error;
  }
};

export const generateChatResponseStream = async (messages: any[]) => {
  try {
    console.log('[OpenAI] Requesting chat completion stream...');
    return await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
    });
  } catch (error: any) {
    console.error('[OpenAI] Chat completion error:', error.message);
    throw error;
  }
};
