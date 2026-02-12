
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { casesApi } from '@/lib/api';
import ChatSection from '@/components/ChatSection';
import { MessageSquare, Bot } from 'lucide-react';

export default function ChatPage() {
  const [selectedCaseId, setSelectedCaseId] = useState('');

  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: casesApi.list
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Legal AI Chat</h1>
          <p className="text-muted-foreground">Interactive legal analysis scoped to your cases.</p>
        </div>
        
        <div className="w-64">
           <select 
              className="w-full bg-black/20 border border-white/10 rounded-md h-10 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50"
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
            >
              <option value="" className="bg-slate-900">Select Case...</option>
              {cases?.data?.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-slate-900">{c.title}</option>
              ))}
            </select>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {selectedCaseId ? (
          <ChatSection caseId={selectedCaseId} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center glass-panel rounded-2xl border border-white/5 bg-white/5 border-dashed">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Ready to assist</h2>
            <p className="text-muted-foreground max-w-sm text-center">
              Please select a case from the dropdown above to start a conversation with the AI about your documents.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
