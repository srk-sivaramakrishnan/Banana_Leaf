// DashboardLayout.tsx
'use client';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    // Set full viewport height and prevent overall scrolling
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar always visible on all screen sizes */}
      <aside className="sticky top-0 h-full">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Navbar always visible */}
        <header className="sticky top-0 z-10">
          <Navbar />
        </header>

        {/* Main content area that scrolls independently */}
        <main className="p-4 md:p-6 flex-1 overflow-y-auto">
          
          {children}
          
          {/* Footer with copyright */}
          <footer className="mt-12 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">© 2025 BananaLeaf AI. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
