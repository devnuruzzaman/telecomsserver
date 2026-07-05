'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Play, RefreshCw, 
  Settings, Users, Percent, Smartphone, Cpu, Sparkles 
} from 'lucide-react';

interface CommissionRule {
  id: string;
  operator: string;
  packageType: 'DATA' | 'VOICE' | 'SMS' | 'COMBO';
  merchantRole: 'DISTRIBUTOR' | 'DEALER' | 'RETAILER';
  commissionRate: number;
}

interface KycSubmission {
  id: string;
  email: string;
  phone: string;
  role: string;
  docType: string;
  docRef: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'commission' | 'kyc'>('commission');

  // Interactive state
  const [rules, setRules] = useState<CommissionRule[]>([
    { id: 'R-01', operator: 'Grameenphone', packageType: 'DATA', merchantRole: 'RETAILER', commissionRate: 2.50 },
    { id: 'R-02', operator: 'Robi Axiata', packageType: 'COMBO', merchantRole: 'DISTRIBUTOR', commissionRate: 3.20 },
    { id: 'R-03', operator: 'Banglalink', packageType: 'VOICE', merchantRole: 'DEALER', commissionRate: 2.00 },
    { id: 'R-04', operator: 'Teletalk', packageType: 'DATA', merchantRole: 'RETAILER', commissionRate: 4.00 }
  ]);

  // Form states for creating a commission rule
  const [newOperator, setNewOperator] = useState('Grameenphone');
  const [newPackageType, setNewPackageType] = useState<'DATA' | 'VOICE' | 'SMS' | 'COMBO'>('DATA');
  const [newRole, setNewRole] = useState<'DISTRIBUTOR' | 'DEALER' | 'RETAILER'>('RETAILER');
  const [newRate, setNewRate] = useState('2.50');

  // Kyc state
  const [kycSubmissions, setKycSubmissions] = useState<KycSubmission[]>([
    { id: 'KYC-001', email: 'merchant.gp@shop.com', phone: '01711223344', role: 'RETAILER', docType: 'NID_PASSPORT', docRef: 'PASS-990142', status: 'PENDING' },
    { id: 'KYC-002', email: 'distributor.asia@telecom.net', phone: '01855599012', role: 'DISTRIBUTOR', docType: 'TRADE_LICENSE', docRef: 'TL-88012A', status: 'PENDING' }
  ]);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0) {
      alert('Please enter a valid rate');
      return;
    }

    const newRule: CommissionRule = {
      id: `R-0${rules.length + 1}`,
      operator: newOperator,
      packageType: newPackageType,
      merchantRole: newRole,
      commissionRate: rate
    };

    setRules(prev => [...prev, newRule]);
    setNewRate('2.50');
  };

  const handleKycAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setKycSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: action };
      }
      return sub;
    }));
  };

  return (
    <div className="space-y-8" id="corporate-admin-view">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-indigo-400" />
          <span>Corporate Admin Panel</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure global routing commission margins and approve agent compliance documents.</p>
      </div>

      {/* Admin Panel Quick Tabs Selector */}
      <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-850 max-w-sm">
        <button
          onClick={() => setActiveTab('commission')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold font-mono transition-all uppercase ${
            activeTab === 'commission' 
              ? 'bg-indigo-600 text-white shadow' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Commission Rules
        </button>
        <button
          onClick={() => setActiveTab('kyc')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold font-mono transition-all uppercase ${
            activeTab === 'kyc' 
              ? 'bg-indigo-600 text-white shadow' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          KYC Verifications
        </button>
      </div>

      {/* Main Container Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Interactive Operations panel */}
        <div className="lg:col-span-8">
          
          {activeTab === 'commission' ? (
            <div className="space-y-8">
              {/* Rules List table */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/20">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Percent className="h-4 w-4 text-indigo-400" />
                    <span>Dynamic Profit Distribution Matrix</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Auto-resolved on execution</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 bg-slate-950/60 font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                        <th className="p-4 pl-6">ID</th>
                        <th className="p-4">Operator</th>
                        <th className="p-4">Package</th>
                        <th className="p-4">Merchant Role</th>
                        <th className="p-4 pr-6 text-right">Commission Split (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs text-slate-300 font-mono">
                      {rules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-slate-900/15">
                          <td className="p-4 pl-6 font-bold text-slate-400">{rule.id}</td>
                          <td className="p-4 text-slate-200">{rule.operator}</td>
                          <td className="p-4">
                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-[10px] text-slate-400">{rule.packageType}</span>
                          </td>
                          <td className="p-4 font-semibold text-indigo-400">{rule.merchantRole}</td>
                          <td className="p-4 pr-6 text-right font-extrabold text-teal-400">{rule.commissionRate.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Configure new rule form */}
              <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-6">
                <div className="border-b border-slate-850 pb-4">
                  <h3 className="text-sm font-semibold text-white">Create Commission Rule</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Establish profit-sharing parameters dynamically based on tenant categories.</p>
                </div>

                <form onSubmit={handleCreateRule} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  {/* Operator */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Operator</label>
                    <select
                      value={newOperator}
                      onChange={(e) => setNewOperator(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-400"
                    >
                      <option value="Grameenphone">Grameenphone</option>
                      <option value="Robi Axiata">Robi Axiata</option>
                      <option value="Banglalink">Banglalink</option>
                      <option value="Airtel Bangladesh">Airtel Bangladesh</option>
                      <option value="Teletalk">Teletalk</option>
                    </select>
                  </div>

                  {/* Package */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Package Type</label>
                    <select
                      value={newPackageType}
                      onChange={(e) => setNewPackageType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-400"
                    >
                      <option value="DATA">DATA</option>
                      <option value="VOICE">VOICE</option>
                      <option value="SMS">SMS</option>
                      <option value="COMBO">COMBO</option>
                    </select>
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Merchant Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-400"
                    >
                      <option value="DISTRIBUTOR">DISTRIBUTOR</option>
                      <option value="DEALER">DEALER</option>
                      <option value="RETAILER">RETAILER</option>
                    </select>
                  </div>

                  {/* Rate */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Split Margin (%)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs font-mono text-slate-200"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          ) : (
            /* KYC Checklist View */
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden space-y-6">
              <div className="p-5 border-b border-slate-850 bg-slate-950/20">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span>Pending Merchant KYC Verifications</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Review legal identification papers uploaded by B2B portal applicants.</p>
              </div>

              <div className="p-6 space-y-4">
                {kycSubmissions.map((sub) => (
                  <div key={sub.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500">{sub.id}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900/40 uppercase">{sub.role}</span>
                        {sub.status !== 'PENDING' && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            sub.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-rose-950 text-rose-400 border border-rose-900/40'
                          }`}>{sub.status}</span>
                        )}
                      </div>
                      <h4 className="text-slate-200 font-semibold">{sub.email}</h4>
                      <p className="text-[10px] text-slate-500">Phone: {sub.phone} · Doc: <strong className="text-slate-300 font-semibold">{sub.docType} ({sub.docRef})</strong></p>
                    </div>

                    {sub.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleKycAction(sub.id, 'APPROVED')}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 hover:text-white border border-emerald-900/40 text-emerald-400 rounded-xl text-xs font-semibold transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleKycAction(sub.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 hover:text-white border border-rose-900/40 text-rose-400 rounded-xl text-xs font-semibold transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Corporate Metrics visual summary charts right */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between h-fit lg:h-full">
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-sm font-semibold text-white">Security Systems Status</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time telemetry and compliance checks</p>
            </div>

            <div className="space-y-3.5 font-mono text-[11px]">
              
              {/* Telemetry card 1 */}
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>API SUITE STATUS</span>
                  <span className="text-emerald-400 font-bold uppercase">100% OPERATIONAL</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
              </div>

              {/* Telemetry card 2 */}
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>SLA RESPONSE LATENCY</span>
                  <span className="text-indigo-400 font-bold font-mono">450ms AVERAGE</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[85%]" />
                </div>
              </div>

              {/* Telemetry card 3 */}
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>BULLMQ WORKER INTENSITY</span>
                  <span className="text-amber-400 font-bold font-mono">2 QUEUES LOADED</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[35%]" />
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-850 text-slate-500 font-mono text-[10px] leading-relaxed">
            <div className="flex gap-1.5 items-center text-slate-400 mb-1 font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Compliance Telemetry</span>
            </div>
            Active NestJS modules are fully validating user roles via standard <code className="bg-slate-900 px-1 rounded">@RolesDecorator</code> guards, checking scopes before processing.
          </div>
        </div>

      </div>

    </div>
  );
}
