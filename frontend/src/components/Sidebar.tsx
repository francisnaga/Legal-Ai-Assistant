
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  LayoutDashboard,
  Settings,
  Scale
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Cases', href: '/dashboard/cases', icon: Briefcase },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Legal Chat', href: '/dashboard/chat', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center gap-2">
        <Scale className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-gradient">Legal AI</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold transition-all'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
            <Link
              href="/dashboard/settings"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <Settings
                className="h-6 w-6 shrink-0 text-muted-foreground group-hover:text-foreground"
                aria-hidden="true"
              />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
