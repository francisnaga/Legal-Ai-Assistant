
'use client';

import { createClient } from '../lib/supabase';

import { useState, useRef, useEffect } from 'react';
import { useApi, chatApi } from '../lib/api';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatSection({ caseId }: { caseId: string }) {
  const api = useApi();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    if (!caseId) return;
    const loadHistory = async () => {
        try {
            const { data } = await chatApi.getHistory(caseId);
            setMessages(data.map((m: any) => ({ role: m.role, content: m.content })));
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };
    loadHistory();
  }, [caseId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !caseId) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage, caseId }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = new TextDecoder().decode(value);
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content += text;
          }
          return newMessages;
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, the request failed. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col glass-panel border-0">
      <CardHeader className="border-b border-white/5 bg-black/20">
        <CardTitle className="flex items-center gap-3">
          <Bot className="w-5 h-5" />
          Legal Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 bg-transparent">
        <ScrollArea className="h-full p-6" ref={scrollRef}>
          <div className="flex flex-col gap-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border flex-shrink-0">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-[80%] whitespace-pre-wrap shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card text-card-foreground border border-border rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
               <div className="flex gap-4 justify-start animate-pulse">
                 <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                   <Bot className="w-4 h-4 text-muted-foreground" />
                 </div>
                 <div className="bg-card rounded-2xl p-4 flex items-center gap-3 border border-border">
                   <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                   <span className="text-sm text-muted-foreground">Analyzing legal documents...</span>
                 </div>
               </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex w-full gap-3">
          <Input 
            className="bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50"
            placeholder="Ask a legal question..." 
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
