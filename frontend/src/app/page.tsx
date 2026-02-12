import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Scale, Shield, Zap, Search, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200 selection:bg-primary/30">
      {/* Hero Section */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Legal AI Assistant</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-sm font-medium hover:text-white transition-colors">Sign In</Link>
            <Button className="rounded-full px-6" asChild>
              <Link href="/auth">Get Started <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Content */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary rounded-full blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Legal Analysis at the <span className="text-gradient">Speed of AI</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Transform your legal practice with a production-ready dashboard. Manage clients, organize cases, and chat with your documents using state-of-the-art RAG technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
               <Button size="lg" className="rounded-full h-14 px-8 text-lg" asChild>
                 <Link href="/auth">Launch Dashboard</Link>
               </Button>
               <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-white/10 hover:bg-white/5" asChild>
                 <Link href="#features">Explore Features</Link>
               </Button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 px-6 bg-slate-950/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Case Management', desc: 'Securely organize documents, chats, and clients in a centralized dashboard.', icon: Shield },
                { title: 'Semantic Search', desc: 'Retrieve precise information across thousands of pages in seconds.', icon: Search },
                { title: 'AI Assistant', desc: 'Get cited answers grounded only in your provided legal context.', icon: Zap },
              ].map((f) => (
                <div key={f.title} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-slate-500">© 2024 Legal AI Assistant. Built for professional legal teams.</p>
        </div>
      </footer>
    </div>
  );
}
