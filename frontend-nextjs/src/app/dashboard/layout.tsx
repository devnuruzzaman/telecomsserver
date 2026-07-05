'use client';

import React, { useState } from 'react';
import Link from 'next/use-selected-layout-segment'; // Fallback link structures
import { usePathname } from 'next/navigation';
import { 
  Layers, Smartphone, Coins, ShieldCheck, HelpCircle, Settings, Menu, X, 
  LogOut, Globe2, Radio, BellRing, ChevronRight, Sparkles 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    { label: 'Merchant Console', icon: Layers, href: '/dashboard' },
    { label: 'Recharge Logs', icon: Smartphone, href: '/dashboard/recharges' },
    { label: 'Wallet Ledger', icon: Coins, href: '/dashboard/wallet' },
    { label: 'Support & Chat', icon: HelpCircle, href: '/dashboard/support' },
    { label: 'Corporate Admin', icon: ShieldCheck, href: '/dashboard/admin' }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100">
      
      {/* Mobile Toggle Navbar */}
      <header className="md:hidden border-b border-slate-900 bg-slate-950/90 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-900 text-indigo-400">
            <Globe2 className="h-4.5 w-4.5" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white uppercase font-display">RechargeSaaS</span>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {/* Desktop Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 w-64 border-r border-slate-900 bg-slate-950/95 backdrop-blur z-30 transition-transform duration-300 md:relative md:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-8">
            {/* Sidebar Branding */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400">
                <Globe2 className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-white uppercase font-display">RechargeSaaS</span>
                <span className="block text-[8px] font-mono text-indigo-400 tracking-wider">SANDBOX NODE #GP99</span>
              </div>
            </div>

            {/* Main Links List */}
            <nav className="space-y-1.5">
              <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest pl-2 mb-2">Core Operations</span>
              {sidebarLinks.map((link, idx) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-slate-900 text-white border border-slate-800/80 shadow-[0_0_12px_rgba(99,102,241,0.06)]' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{link.label}</span>
                    {isActive && <ChevronRight className="h-3 w-3 text-indigo-400 ml-auto" />}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Quick Sandbox Warning info bar */}
          <div className="space-y-4 pt-6 border-t border-slate-900">
            <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Simulation Ready</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                Prisma Client and transactional triggers are fully simulated on mock states.
              </p>
            </div>

            <a 
              href="/" 
              className="flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-900/20 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit Console</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace viewport */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        
        {/* Secure Top Nav */}
        <nav className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur z-20">
          <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Connection Secure</span>
            <span className="text-slate-700">|</span>
            <span>Role: <strong className="text-indigo-400 font-bold">B2B_RETAILER</strong></span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Balance indicator widget */}
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-slate-500 text-[10px]">MAIN:</span>
              <span className="text-teal-400 font-bold">$12,450.00</span>
            </div>

            <button className="p-2 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white relative">
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <BellRing className="h-4 w-4" />
            </button>
          </div>
        </nav>

        {/* Inner page content container */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {children}
        </main>

        {/* Polished sandbox footer */}
        <footer className="border-t border-slate-900 bg-slate-950/60 px-8 py-4 text-center text-slate-600 font-mono text-[10px] flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>Active Session ID: <strong className="text-slate-400 font-bold">cfa8bc04-8b01-49e0-81f1-3be22ce87e04</strong></span>
          <span>Complies with PCI-DSS & ISO-27001 Financial standards</span>
        </footer>
      </div>

    </div>
  );
}
