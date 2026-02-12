
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Check for email confirmation requirement?
        setError('Check your email for confirmation link (if configured).');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md glass-panel border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-white">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</CardTitle>
          <CardDescription className="text-slate-400">
            {mode === 'signin' ? 'Enter your credentials to access your workspace.' : 'Sign up to start analyzing legal documents.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-blue-500/50 h-10"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/20 border-white/10 text-white focus-visible:ring-blue-500/50 h-10"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white h-10 rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {mode === 'signin' ? (
                <>Don't have an account? <span className="text-blue-400 font-medium">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-blue-400 font-medium">Sign in</span></>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
