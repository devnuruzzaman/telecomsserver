import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Architecture from './components/Architecture';
import DatabaseDesign from './components/DatabaseDesign';
import FolderStructure from './components/FolderStructure';
import Roadmap from './components/Roadmap';
import SecurityApi from './components/SecurityApi';
import AndroidApp from './components/AndroidApp';
import Login from './components/Login';
import { 
  Layers, Database, Terminal, Calendar, ShieldCheck, Cpu, 
  Smartphone, BarChart3, Radio, ArrowUpRight, Network, Lock
} from 'lucide-react';

type TabType = 'dashboard' | 'architecture' | 'database' | 'folders' | 'roadmap' | 'security' | 'android';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem('user_role');
  });

  const isLoginPath = window.location.pathname === '/login' || window.location.pathname === '/login/';

  if (isLoginPath) {
    return <Login />;
  }

  const navigationTabs = [
    { id: 'dashboard' as TabType, label: 'Platform Scope', icon: Layers, desc: 'Target Users & Capabilities' },
    { id: 'architecture' as TabType, label: 'System Topology', icon: Network, desc: 'Interactive Architecture Map' },
    { id: 'database' as TabType, label: 'Database Schema', icon: Database, desc: 'ER Relationships & SQL' },
    { id: 'folders' as TabType, label: 'File Structure', icon: Terminal, desc: 'Unified Codebase Trees' },
    { id: 'android' as TabType, label: 'Android Portal', icon: Smartphone, desc: 'Jetpack Compose & MD3' },
    { id: 'roadmap' as TabType, label: 'Dev Roadmap', icon: Calendar, desc: '10-Week Gantt Sprints' },
    { id: 'security' as TabType, label: 'Security & APIs', icon: ShieldCheck, desc: 'OWASP-10 & REST Specs' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)] shrink-0">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-display tracking-tight text-white">RECHARGESAAS</h1>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-900/40 text-indigo-400">BLUEPRINT v1.1</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">Enterprise Telecom Recharge & Billing Platform Architect</p>
            </div>
          </div>

          {/* Quick Metrics & Target Standard Status */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-850 px-3 py-1.5 rounded-lg">
              <span className="flex h-1.5 w-1.5 rounded-full bg-teal-400" />
              <span className="text-slate-400">System State:</span>
              <span className="text-white font-semibold">PLAN_READY</span>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-850 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400">Arch Standard:</span>
              <span className="text-indigo-400 font-semibold">12-FACTOR APP</span>
            </div>

            {userRole ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 font-mono text-xs">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Role: <strong className="text-white">{userRole}</strong></span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('user_role');
                    setUserRole(null);
                    window.location.reload();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white text-slate-400 font-semibold transition-colors cursor-pointer text-xs"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => window.location.href = '/login'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all cursor-pointer font-sans text-xs"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>B2B Portal Login</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        
        {/* Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 border-b border-slate-900 pb-6">
          {navigationTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[100px] ${
                  isActive
                    ? 'bg-slate-900 text-white border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  {isActive && <ArrowUpRight className="h-3 w-3 text-indigo-400" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold font-sans tracking-tight">{tab.label}</h3>
                  <p className="text-[9px] text-slate-500 truncate mt-0.5">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Renderer */}
        <div className="min-h-[450px]">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'architecture' && <Architecture />}
          {activeTab === 'database' && <DatabaseDesign />}
          {activeTab === 'folders' && <FolderStructure />}
          {activeTab === 'android' && <AndroidApp />}
          {activeTab === 'roadmap' && <Roadmap />}
          {activeTab === 'security' && <SecurityApi />}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            <span>© 2026 RechargeSaaS Technical Engineering Division. All systems standard.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition-colors">Audit compliance: ISO-27001</span>
            <span className="hover:text-slate-300 transition-colors">Financial standard: PCI-DSS Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

