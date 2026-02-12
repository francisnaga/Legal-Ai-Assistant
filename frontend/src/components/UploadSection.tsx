
'use client';

import { useState } from 'react';
import { useApi } from '../lib/api';
import { useMutation } from '@tanstack/react-query';
import { Upload, File, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button'; // Assuming shadcn will create this
// We will use standard HTML input for file upload or dropzone if we had time to implement drag-n-drop
// For simplicity, sticking to input type="file" styled nicely.

export default function UploadSection({ caseId }: { caseId: string }) {
  const api = useApi();
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('caseId', caseId);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      setFile(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-border/50">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
        <div className="p-2 bg-muted rounded-lg">
          <Upload className="w-5 h-5 text-muted-foreground" />
        </div>
        Upload Document
      </h2>
      
      <div className="flex flex-col gap-6">
        <div className="relative group border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-all cursor-pointer">
          <input 
            type="file" 
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform">
             {file ? (
               <>
                 <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <File className="w-8 h-8 text-primary" />
                 </div>
                 <span className="text-sm font-medium">{file.name}</span>
               </>
             ) : (
               <>
                 <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground/70">PDF, DOCX, or TXT (Max 10MB)</p>
                 </div>
               </>
             )}
          </div>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!file || uploadMutation.isPending}
          className="w-full py-6 text-lg"
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
            </>
          ) : uploadMutation.isSuccess ? (
             <>
               <CheckCircle className="mr-2 h-5 w-5" /> Documents Secured
             </>
          ) : (
            'Process Document'
          )}
        </Button>
        {uploadMutation.isError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive text-center flex items-center justify-center gap-2">
                <span>⚠️</span> {(uploadMutation.error as any).response?.data?.error || 'Upload failed'}
              </p>
          </div>
        )}
      </div>
    </div>
  );
}
