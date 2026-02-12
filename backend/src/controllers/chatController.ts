
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { generateEmbedding, generateChatResponseStream } from '../services/openaiService';

export const chatWithDocument = async (req: Request, res: Response) => {
  try {
    const { message, caseId } = req.body;
    const { userId } = (req as any).auth || {};

    console.log(`[Chat] Request from user ${userId} for case ${caseId}: "${message}"`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!caseId) {
      return res.status(400).json({ error: 'Case ID is required' });
    }

    // 1. Generate embedding for user query
    console.log('[Chat] Generating embedding...');
    const embedding = await generateEmbedding(message);

    // 2. Search for relevant chunks scoping to case
    console.log('[Chat] Searching for relevant chunks in case...');
    const { data: chunks, error: matchError } = await supabase.rpc('match_case_documents', {
      query_embedding: embedding,
      match_threshold: 0.2, 
      match_count: 5,
      filter_case_id: caseId,
      filter_user_id: userId,
    });

    if (matchError) {
      console.error('[Chat] match_case_documents error:', matchError);
      throw matchError;
    }

    console.log(`[Chat] Found ${chunks?.length || 0} chunks.`);

    // 3. Construct context
    let context = '';
    chunks?.forEach((chunk: any) => {
      context += `[Source: ${chunk.document_id}, Chunk: ${chunk.chunk_index}]\n${chunk.content}\n\n`;
    });

    // 4. Save user message to case history
    await supabase.from('case_messages').insert({
      case_id: caseId,
      user_id: userId,
      role: 'user',
      content: message
    });

    // 5. Create messages for LLM
    const messages = [
      {
        role: 'system',
        content: `You are a professional legal document analysis assistant. Only answer using the provided context. If the answer is not in the context, say you do not know.\n\nContext:\n${context || 'No documents uploaded to this case yet.'}`,
      },
      {
        role: 'user',
        content: message,
      },
    ];

    // 6. Stream response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log('[Chat] Starting stream from OpenAI...');
    const stream = await generateChatResponseStream(messages);

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        res.write(content);
      }
    }

    // 7. Save assistant message to case history
    if (fullResponse) {
      await supabase.from('case_messages').insert({
        case_id: caseId,
        user_id: userId,
        role: 'assistant',
        content: fullResponse
      });
    }

    console.log('[Chat] Stream finished.');
    res.end();
  } catch (error: any) {
    console.error('Chat error details:', error);
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;
    const { userId } = (req as any).auth;

    const { data, error } = await supabase
      .from('case_messages')
      .select('*')
      .eq('case_id', caseId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
