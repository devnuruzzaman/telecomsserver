import React, { useState } from 'react';
import { USER_ROLES } from '../data';
import { 
  Users, ShieldCheck, Database, Layers, CheckCircle2, 
  Smartphone, Wallet, Zap, Key, RefreshCw, BarChart3, Star
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState(USER_ROLES[0].name);
  const activeRoleInfo = USER_ROLES.find(r => r.name === selectedRole) || USER_ROLES[0];

  const highlights = [
    { title: 'Prepaid & Postpaid', desc: 'Auto-detection and multi-gateway routing', icon: Smartphone, color: 'text-teal-400 bg-teal-950/40 border-teal-800/60' },
    { title: 'Ledger Wallets', desc: 'Double-entry auditing and ledger streams', icon: Wallet, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/60' },
    { title: 'Commission Dispatcher', desc: 'Hierarchical recursive margin calculation', icon: Zap, color: 'text-pink-400 bg-pink-950/40 border-pink-800/60' },
    { title: 'Enterprise RBAC', desc: '11 fully mapped business access roles', icon: ShieldCheck, color: 'text-amber-400 bg-amber-950/40 border-amber-800/60' },
  ];

  const stats = [
    { label: 'Target System SLA', value: '99.99%', sub: 'High availability clusters' },
    { label: 'Processing Speed', value: '<2.5s', sub: 'Average operator callback handshake' },
    { label: 'Platform Security', value: 'OWASP-10', sub: 'Secure token authentication' },
    { label: 'Max Concurrency', value: '15k /sec', sub: 'BullMQ message broker standard' }
  ];

  return (
    <div className="space-y-8" id="dashboard-tab-content">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 md:p-12">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />
        
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-800/60 bg-indigo-950/40 px-3.5 py-1 text-xs font-medium text-indigo-400 tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Architectural Master Plan
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-[1.1]">
            Enterprise Telecom <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Recharge & Billing</span> SaaS Platform
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            A pristine blueprint outlining a multi-tenant, distributed telecom airtime billing architecture. Features include sub-millisecond wallet ledger systems, hierarchical commission routing, and multi-gateway fallbacks.
          </p>
        </div>
      </div>

      {/* SLA & Target Performance Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl hover:border-slate-700/80 transition-colors"
          >
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-3xl md:text-4xl font-bold font-mono text-white mt-1 mb-2 tracking-tight">{s.value}</p>
            <p className="text-sm text-slate-400 leading-snug">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Core Architectural Highlights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-teal-400" />
          <h2 className="text-xl font-bold text-white font-display">System Core Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-xl flex flex-col justify-between hover:border-slate-700/60 transition-all group"
              >
                <div className={`p-3 rounded-lg border w-fit ${h.color} mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-200">{h.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target User Roles Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white font-display">Hierarchical User Scopes</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Multi-tenant structures map permissions down 11 target business roles, supporting operations from Super Admin platform owners to Retail point-of-sale operators and end consumers.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {USER_ROLES.map((role) => (
              <button
                key={role.name}
                onClick={() => setSelectedRole(role.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedRole === role.name
                    ? 'bg-indigo-950/60 text-indigo-400 border-indigo-800/80'
                    : 'bg-slate-900/30 text-slate-400 border-slate-800/80 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 font-mono text-xs text-slate-600">ROLE_INFO</div>
          
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/50">Active Role Profile</span>
              <h3 className="text-2xl font-bold text-white font-display mt-2">{activeRoleInfo.name}</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{activeRoleInfo.description}</p>
            </div>

            <div className="border-t border-slate-800/80 pt-4 space-y-2">
              <span className="text-xs font-mono text-slate-500 uppercase">Operational Target Scope</span>
              <p className="text-sm text-slate-300 leading-relaxed">{activeRoleInfo.scope}</p>
            </div>

            <div className="border-t border-slate-800/80 pt-4 space-y-3">
              <span className="text-xs font-mono text-slate-500 uppercase">Assigned Core Permissions</span>
              <div className="flex flex-wrap gap-2">
                {activeRoleInfo.permissions.map((p, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1 text-xs font-mono text-teal-400 border border-slate-800"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-500/80" />
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Identity Class: Enterprise Tenant</span>
            <span>Policy Status: Standard Enforce</span>
          </div>
        </div>
      </div>
    </div>
  );
}
