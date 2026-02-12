
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, Edit2, UserPlus } from 'lucide-react';

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', contact_info: '' });
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.list
  });

  const createMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      setFormData({ name: '', contact_info: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  const filteredClients = clients?.data?.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Clients</h1>
          <p className="text-muted-foreground">Manage your legal clients and their information.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..." 
            className="pl-9 bg-black/20 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-4 text-sm font-semibold text-white">Name</th>
              <th className="p-4 text-sm font-semibold text-white">Contact Info</th>
              <th className="p-4 text-sm font-semibold text-white">Created At</th>
              <th className="p-4 text-sm font-semibold text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading clients...</td></tr>
            ) : filteredClients?.map((client: any) => (
              <tr key={client.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm text-white font-medium">{client.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{client.contact_info || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{new Date(client.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredClients?.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No clients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Modal Implementation for Add Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-8 rounded-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-white mb-6">Add New Client</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Name</label>
                <Input 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/20 border-white/10 h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Contact Info</label>
                <Input 
                  placeholder="email@example.com, phone, etc." 
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                  className="bg-black/20 border-white/10 h-11"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
              <Button 
                onClick={() => createMutation.mutate(formData)} 
                disabled={!formData.name || createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending ? 'Saving...' : 'Create Client'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
