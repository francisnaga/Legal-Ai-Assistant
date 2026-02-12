
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { casesApi } from '@/lib/api';
import { createClient } from '@/lib/supabase';
import UploadSection from '@/components/UploadSection';
import { FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocumentsPage() {
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const supabase = createClient();

  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: casesApi.list
  });

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', selectedCaseId],
    queryFn: async () => {
      if (!selectedCaseId) return [];
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', selectedCaseId);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCaseId
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Documents</h1>
        <p className="text-muted-foreground">Upload and manage legal files per case.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <label className="text-sm font-medium text-slate-300">Select Case</label>
            <select 
              className="w-full bg-black/20 border border-white/10 rounded-md h-11 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50"
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
            >
              <option value="" className="bg-slate-900">Choose a Case...</option>
              {cases?.data?.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-slate-900">{c.title}</option>
              ))}
            </select>
          </div>

          {selectedCaseId ? (
            <UploadSection caseId={selectedCaseId} />
          ) : (
            <div className="p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Select a case to upload documents.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-semibold text-white">Case Files</h3>
              <span className="text-xs text-muted-foreground">{documents?.length || 0} files</span>
            </div>
            <div className="divide-y divide-white/5">
              {isLoading ? (
                <div className="p-12 text-center text-muted-foreground">Loading documents...</div>
              ) : documents?.map((doc: any) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{doc.filename}</p>
                      <p className="text-xs text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white" asChild>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!documents || documents.length === 0) && (
                <div className="p-12 text-center text-muted-foreground">
                  {selectedCaseId ? 'No documents found for this case.' : 'Please select a case to view files.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
