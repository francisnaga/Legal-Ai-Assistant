
import fs from 'fs';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

export const extractText = async (file: Express.Multer.File): Promise<string> => {
  const fileBuffer = fs.readFileSync(file.path);
  
  if (file.mimetype === 'application/pdf') {
    const data = await pdf(fileBuffer);
    return data.text;
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } else if (file.mimetype === 'text/plain') {
    return fileBuffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file type');
  }
};

export const chunkText = (text: string, chunkSize: number = 900, overlap: number = 200): string[] => {
  // Simple character-based chunking for now (ideally use a tokenizer)
  // Assuming ~4 chars per token, 900 tokens ~= 3600 chars
  // 200 tokens ~= 800 chars
  
  const charChunkSize = chunkSize * 4;
  const charOverlap = overlap * 4;
  
  const chunks: string[] = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    let endIndex = startIndex + charChunkSize;
    if (endIndex > text.length) {
      endIndex = text.length;
    }
    
    chunks.push(text.slice(startIndex, endIndex));
    
    if (endIndex === text.length) {
      break;
    }
    
    startIndex += (charChunkSize - charOverlap);
  }
  
  return chunks;
};
