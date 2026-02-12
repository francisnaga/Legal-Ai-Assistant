
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesApi, clientsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Briefcase, Search, Plus, Trash2, Edit2, Filter } from 'lucide-react';

export default function CasesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ title: '', client_id: '', type: 'Civil', status: 'open' });
  const queryClient = useQueryClient();

  const { data: cases, isLoading: casesLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: casesApi.list
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.list
  });

  const createMutation = useMutation({
    mutationFn: casesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      setIsModalOpen(false);
      setFormData({ title: '', client_id: '', type: 'Civil', status: 'open' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: casesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    }
  });

  const filteredCases = cases?.data?.filter((c: any) => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Cases</h1>
          <p className="text-muted-foreground">Manage legal cases assigned to your clients.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Briefcase className="h-4 w-4" /> New Case
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search cases..." 
            className="pl-9 bg-black/20 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="border-white/10 bg-white/5">
            <Filter className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {casesLoading ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">Loading cases...</div>
        ) : filteredCases?.map((c: any) => (
          <div key={c.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${c.status === 'open' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'}`}>
                <Briefcase className="h-5 w-5" />
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                c.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
              }`}>
                {c.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">{c.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{c.type} • {c.clients?.name}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-muted-foreground">Created {new Date(c.created_at).toLocaleDateString()}</span>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                        <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate(c.id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
          </div>
        ))}
        {filteredCases?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-white/5 rounded-2xl border border-dashed border-white/10">
                No cases found. Create your first case to get started.
            </div>
        )}
      </div>

      {/* Manual Modal Implementation for New Case */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-8 rounded-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-white mb-6">Create New Case</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Case Title</label>
                <Input 
                  placeholder="e.g., Smith vs Jones" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-black/20 border-white/10 h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Client</label>
                <select 
                   className="w-full bg-black/20 border border-white/10 rounded-md h-11 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50"
                   value={formData.client_id}
                   onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                >
                    <option value="" className="bg-slate-900">Select Client</option>
                    {clients?.data?.map((client: any) => (
                        <option key={client.id} value={client.id} className="bg-slate-900">{client.name}</option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Type</label>
                    <Input 
                        placeholder="e.g., Civil" 
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="bg-black/20 border-white/10 h-11"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Status</label>
                    <select 
                        className="w-full bg-black/20 border border-white/10 rounded-md h-11 px-3 text-sm text-white outline-none"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="open" className="bg-slate-900">Open</option>
                        <option value="closed" className="bg-slate-900">Closed</option>
                    </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
              <Button 
                onClick={() => createMutation.mutate(formData)} 
                disabled={!formData.title || !formData.client_id || createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending ? 'Processing...' : 'Create Case'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
