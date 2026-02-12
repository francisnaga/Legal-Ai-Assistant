
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { clientsApi, casesApi } from '@/lib/api';

export default function DashboardPage() {
  const { data: clients } = useQuery({ queryKey: ['clients'], queryFn: clientsApi.list });
  const { data: cases } = useQuery({ queryKey: ['cases'], queryFn: casesApi.list });

  const stats = [
    { name: 'Total Clients', value: clients?.data?.length || 0, icon: Users, color: 'text-blue-500' },
    { name: 'Active Cases', value: cases?.data?.filter((c: any) => c.status === 'open').length || 0, icon: Briefcase, color: 'text-purple-500' },
    { name: 'Total Documents', value: '...', icon: FileText, color: 'text-pink-500' },
    { name: 'AI Responses', value: '...', icon: MessageSquare, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back to your Legal AI Assistant.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="glass-panel border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="glass-panel border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cases?.data?.slice(0, 5).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div>
                    <p className="font-medium text-white">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.type} • {c.clients?.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                    c.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
              {(!cases?.data || cases.data.length === 0) && (
                <p className="text-center text-muted-foreground py-4 text-sm">No cases found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {clients?.data?.slice(0, 5).map((client: any) => (
                <div key={client.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                   <p className="font-medium text-white">{client.name}</p>
                   <p className="text-xs text-muted-foreground">{new Date(client.created_at).toLocaleDateString()}</p>
                </div>
              ))}
              {(!clients?.data || clients.data.length === 0) && (
                <p className="text-center text-muted-foreground py-4 text-sm">No clients found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
