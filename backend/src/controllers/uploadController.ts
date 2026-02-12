
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { extractText, chunkText } from '../services/documentService';
import { generateEmbedding } from '../services/openaiService';
import fs from 'fs';

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only PDF, DOCX, and TXT are supported.' });
    }

    const { userId } = (req as any).auth || {}; // From Supabase Auth middleware
    const { caseId } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!caseId) {
        return res.status(400).json({ error: 'Case ID is required' });
    }

    const file = req.file;
    const text = await extractText(file);
    const chunks = chunkText(text);

    // 2. Insert into documents table
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        case_id: caseId,
        filename: file.originalname,
        file_url: file.path, 
      })
      .select()
      .single();

    if (docError) throw docError;

    // 3. Process chunks and embeddings
    const chunkInserts = await Promise.all(
      chunks.map(async (chunk, index) => {
        const embedding = await generateEmbedding(chunk);
        return {
          document_id: docData.id,
          user_id: userId,
          content: chunk,
          embedding,
          chunk_index: index,
        };
      })
    );

    // 4. Insert chunks
    const { error: chunkError } = await supabase
      .from('document_chunks')
      .insert(chunkInserts);

    if (chunkError) throw chunkError;

    // Cleanup local file
    fs.unlinkSync(file.path);

    res.status(200).json({ message: 'Document processed successfully', documentId: docData.id });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};
