import React, { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Enterprise Telecom Airtime & SaaS PWA Platform',
  description: 'Instant multi-tenant recharge, ledger balancing, and dynamic commission SaaS solutions.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white antialiased">
        <div className="relative min-h-screen flex flex-col justify-between">
          {/* Subtle cosmic ambient backgrounds */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 flex-1 flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
