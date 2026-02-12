'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Scale, Menu } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="glass-header sticky top-0 z-50 flex h-16 w-full items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4 lg:hidden">
        <Scale className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-gradient">Legal AI</span>
      </div>
      <div className="flex-1 lg:flex items-center justify-end gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <Button size="sm" asChild>
            <Link href="/auth">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
