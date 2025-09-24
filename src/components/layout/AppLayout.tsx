import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Toaster } from '@/components/ui/sonner';
export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Outlet />
      </main>
      <Toaster 
        theme="dark"
        toastOptions={{
          classNames: {
            toast: 'bg-card border-neon-magenta text-foreground font-mono',
            title: 'text-neon-magenta',
            description: 'text-muted-foreground',
          },
        }}
      />
    </div>
  );
};