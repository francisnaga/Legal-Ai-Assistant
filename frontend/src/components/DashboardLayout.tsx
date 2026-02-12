
import { Sidebar } from './Sidebar';
import Header from './Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
