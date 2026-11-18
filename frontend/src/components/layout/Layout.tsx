import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';
import { AIAssistantWidget } from '../ai/AIAssistantWidget';

export const Layout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Body (offset by sidebar width on desktop) */}
      <div className="lg:pl-[232px] flex flex-col flex-1 min-w-0">
        <TopHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-20 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>

        <MobileNav />
      </div>

      {/* Globally accessible AI Copilot Widget */}
      <AIAssistantWidget />
    </div>
  );
};
