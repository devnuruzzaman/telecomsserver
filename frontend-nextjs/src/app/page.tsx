'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, Smartphone, ShieldCheck, Activity, ArrowRight, CheckCircle2, 
  Coins, Terminal, Network, Zap, Play, Globe2, HelpCircle 
} from 'lucide-react';

export default function LandingPage() {
  const [selectedApiTab, setSelectedApiTab] = useState<'recharge' | 'balance' | 'webhooks'>('recharge');

  const liveStats = [
    { label: 'Avg Gateway Latency', value: '450ms', color: 'text-teal-400' },
    { label: 'SLA Success Rate', value: '99.94%', color: 'text-indigo-400' },
    { label: 'Active Operator Pipes', value: '180+', color: 'text-amber-400' },
    { label: '24h Trx Volume', value: '$2.4M+', color: 'text-emerald-400' }
  ];

  const valueProps = [
    {
      icon: Zap,
      title: 'Sub-Second Handshakes',
      desc: 'Our transaction processing pipelines bypass traditional delays to deliver airtime within 1 to 3 seconds globally.'
    },
    {
      icon: Coins,
      title: 'Automated Commission Splits',
      desc: 'Define complex multi-tier margin hierarchies. Payouts disperse instantly to main, commission, or cashback balances.'
    },
    {
      icon: ShieldCheck,
      title: 'PCI-DSS Ledger Safety',
      desc: 'Double-entry general ledger architecture guarantees balance safety and prevents double-spending during network timeouts.'
    }
  ];

  const apiSnippets = {
    recharge: `curl -X POST "https://api.rechargesaas.com/v1/recharges/execute" \\
  -H "Authorization: Bearer r_live_sec_key_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient_number": "+8801712345678",
    "operator_code": "GP",
    "amount": 10.00,
    "client_reference": "POS_INV_24075"
  }'`,
    balance: `curl -G "https://api.rechargesaas.com/v1/wallets/balance" \\
  -H "Authorization: Bearer r_live_sec_key_..."`,
    webhooks: `curl -X POST "https://api.rechargesaas.com/v1/webhooks/subscriptions" \\
  -H "Authorization: Bearer r_live_sec_key_..." \\
  -d '{
    "callback_url": "https://api.yoursite.com/callbacks",
    "subscribed_events": ["RECHARGE.SUCCESS", "RECHARGE.FAILED"]
  }'`
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Upper Navigation Bar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white uppercase">RechargeSaaS</span>
              <span className="block text-[9px] font-mono text-slate-500">GLOBAL AIRTIME HUB</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
            >
              Go to Sandbox Console <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Container */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-900 text-[11px] font-mono text-indigo-300">
            <Zap className="h-3.5 w-3.5 animate-bounce text-indigo-400" />
            <span>Multi-Tenant Telecom SaaS Architecture</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            High-Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Telecom Recharge API</span> & Ledger Solutions
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
            Connect your merchant stores, POS locations, and apps to high-availability mobile operators. Enjoy instant commission splits, automated local number detection, and immutable financial ledgers.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <Link 
              href="/dashboard" 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-2 text-center"
            >
              Launch Platform Explorer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 hover:text-white font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 text-center"
            >
              <Play className="h-3.5 w-3.5" /> B2B Agent Onboarding
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-900">
            {liveStats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <span className={`block text-lg font-bold font-mono ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Code / Visual Sandbox Hero Right */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col h-[400px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-rose-500" />
              <span className="flex h-3 w-3 rounded-full bg-amber-500" />
              <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">recharge_api_client.sh</span>
            </div>
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-850">
              {(['recharge', 'balance', 'webhooks'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedApiTab(tab)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase transition-all ${
                    selectedApiTab === tab 
                      ? 'bg-indigo-950 text-indigo-400 font-bold border border-indigo-800/60' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Console */}
          <div className="flex-1 bg-slate-950 rounded-xl p-4 overflow-y-auto border border-slate-850 font-mono text-xs text-slate-300 leading-relaxed scrollbar">
            <pre className="whitespace-pre-wrap">{apiSnippets[selectedApiTab]}</pre>
          </div>

          {/* Prompt Trigger Status bar */}
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-850 pt-3">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Response: 200 OK</span>
            </div>
            <span>HTTPS/TLS v1.3</span>
          </div>
        </div>
      </section>

      {/* Bullet Proof Value Props */}
      <section className="bg-slate-950 border-t border-slate-900 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-white font-display">Engineered for Telecom Resilience</h2>
            <p className="text-xs text-slate-400">
              Avoid failed customer top-ups, transaction disputes, or double debits. Our architecture incorporates rigorous financial safeguards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div key={idx} className="bg-slate-900/30 border border-slate-900/60 p-6 rounded-xl hover:border-slate-800 transition-all flex gap-4">
                  <div className="p-2 bg-indigo-950/80 rounded-lg text-indigo-400 border border-indigo-900/60 h-fit shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-white">{prop.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{prop.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-slate-500 font-mono text-xs">
        <p>© 2026 RechargeSaaS Technical Engineering. Compliant with PCI-DSS, ISO-27001 and GDPR directives.</p>
      </footer>
    </div>
  );
}
