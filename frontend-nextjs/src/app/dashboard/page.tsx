'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Smartphone, BarChart3, Radio, ArrowUpRight, CheckCircle2, 
  Clock, ShieldAlert, Sparkles, RefreshCw, Send, AlertTriangle, Play, Coins 
} from 'lucide-react';

interface Operator {
  code: string;
  name: string;
  color: string;
  prefixes: string[];
}

interface Package {
  id: string;
  name: string;
  type: 'DATA' | 'VOICE' | 'SMS' | 'COMBO';
  price: number;
  validity: string;
  description: string;
}

export default function MerchantConsolePage() {
  // Mock Wallets state
  const [mainBalance, setMainBalance] = useState(12450.00);
  const [commissionBalance, setCommissionBalance] = useState(248.50);
  const [cashbackBalance, setCashbackBalance] = useState(15.20);

  // Form state
  const [recipientNumber, setRecipientNumber] = useState('');
  const [detectedOperator, setDetectedOperator] = useState<Operator | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState<string>('15.00');
  const [isPostpaid, setIsPostpaid] = useState(false);
  const [clientReference, setClientReference] = useState('RECH_SANDBOX_01');

  // Interactive transaction states
  const [rechargeStatus, setRechargeStatus] = useState<'IDLE' | 'BALANCE_CHECK' | 'DEBIT_LOCK' | 'QUEUED' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [rechargeLog, setRechargeLog] = useState<Array<{ id: string; number: string; operator: string; amount: number; status: string; date: string }>>([
    { id: 'REC-99041', number: '01755512345', operator: 'Grameenphone', amount: 15.00, status: 'SUCCESS', date: 'Just Now' },
    { id: 'REC-99040', number: '01811122233', operator: 'Robi Axiata', amount: 20.00, status: 'SUCCESS', date: '12 mins ago' },
    { id: 'REC-99039', number: '01912345678', operator: 'Banglalink', amount: 50.00, status: 'FAILED', date: '1 hour ago' }
  ]);

  // Operator Catalogs
  const operators: Operator[] = [
    { code: 'GP', name: 'Grameenphone', color: 'border-sky-500 text-sky-400 bg-sky-950/20', prefixes: ['017', '013', '88017', '88013'] },
    { code: 'ROBI', name: 'Robi Axiata', color: 'border-rose-500 text-rose-400 bg-rose-950/20', prefixes: ['018', '88018'] },
    { code: 'BL', name: 'Banglalink', color: 'border-orange-500 text-orange-400 bg-orange-950/20', prefixes: ['019', '014', '88019', '88014'] },
    { code: 'Airtel', name: 'Airtel Bangladesh', color: 'border-red-500 text-red-400 bg-red-950/20', prefixes: ['016', '88016'] },
    { code: 'Tele', name: 'Teletalk', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/20', prefixes: ['015', '88015'] }
  ];

  // Package Catalogs
  const packages: Package[] = [
    { id: 'pkg-1', name: 'Unlimited Social Pack', type: 'DATA', price: 15.00, validity: '7 Days', description: 'Includes 15GB super-fast data mapped to Meta/WhatsApp domains.' },
    { id: 'pkg-2', name: 'Super Combo Unlimited', type: 'COMBO', price: 29.99, validity: '30 Days', description: 'Includes 50GB data, 1000 standard minutes, and 500 SMS.' },
    { id: 'pkg-3', name: 'Voice Premium Talktime', type: 'VOICE', price: 9.99, validity: '15 Days', description: 'Includes 600 any-net voice call minutes.' },
    { id: 'pkg-4', name: 'Lite SMS Bundle', type: 'SMS', price: 4.50, validity: '3 Days', description: 'Includes 500 standard SMS.' }
  ];

  // Prefix auto detection hook
  useEffect(() => {
    const cleanNumber = recipientNumber.replace(/[^0-9]/g, '');
    let matched: Operator | null = null;
    
    for (const op of operators) {
      if (op.prefixes.some(p => cleanNumber.startsWith(p))) {
        matched = op;
        break;
      }
    }
    setDetectedOperator(matched);
  }, [recipientNumber]);

  // Handle direct package select updates form amounts
  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setRechargeAmount(pkg.price.toFixed(2));
  };

  // Run the full animated recharge process
  const triggerRechargeFlow = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(rechargeAmount);

    if (recipientNumber.length < 9) {
      alert('Please enter a valid phone number');
      return;
    }

    if (finalAmount > mainBalance) {
      setRechargeStatus('FAILED');
      return;
    }

    // Step-by-Step state-machine animation to show NestJS process
    setRechargeStatus('BALANCE_CHECK');
    
    setTimeout(() => {
      setRechargeStatus('DEBIT_LOCK');
      // Simulated pre-debit
      setMainBalance(prev => prev - finalAmount);
      
      setTimeout(() => {
        setRechargeStatus('QUEUED');
        
        setTimeout(() => {
          setRechargeStatus('PROCESSING');
          
          setTimeout(() => {
            setRechargeStatus('SUCCESS');
            const commission = finalAmount * 0.02; // 2% commission preset
            setCommissionBalance(prev => prev + commission);
            
            // Log entry
            const newLog = {
              id: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
              number: recipientNumber,
              operator: detectedOperator?.name || 'Manual Operator',
              amount: finalAmount,
              status: 'SUCCESS',
              date: 'Just Now'
            };
            setRechargeLog(prev => [newLog, ...prev]);
            
            // Clear inputs
            setRecipientNumber('');
            setSelectedPackage(null);
            setRechargeAmount('15.00');
          }, 1500);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-8" id="merchant-dashboard-view">
      
      {/* Sec 1: Welcome Header & Quick Action Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">Merchant Console</h1>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/60 font-mono font-bold px-2 py-0.5 rounded-full uppercase">PWA ACTIVE</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">SaaS node orchestrating high-availability cellular topups.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => {
              setMainBalance(12450.00);
              setCommissionBalance(248.50);
              setCashbackBalance(15.20);
              setRechargeStatus('IDLE');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Balance</span>
          </button>
        </div>
      </div>

      {/* Sec 2: Triple-Wallet Grid (Main, Commission, Cashback) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main balance wallet */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors pointer-events-none" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-400 font-mono">Main balance Ledger</span>
            <div className="p-2 bg-teal-950/60 rounded-xl text-teal-400 border border-teal-900/50">
              <Wallet className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-teal-400">${mainBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="mt-4 pt-4 border-t border-slate-850 flex justify-between text-[10px] font-mono text-slate-500">
            <span>Deducts on top-up requests</span>
            <span className="text-teal-400 font-semibold uppercase">SECURE LEDGER</span>
          </div>
        </div>

        {/* Commission wallet */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-400 font-mono">Earned Commissions</span>
            <div className="p-2 bg-indigo-950/60 rounded-xl text-indigo-400 border border-indigo-900/50">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-indigo-400">${commissionBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="mt-4 pt-4 border-t border-slate-850 flex justify-between text-[10px] font-mono text-slate-500">
            <span>Disbursed automatically (2% rate)</span>
            <span className="text-indigo-400 font-semibold uppercase">AUTO PAYOUT</span>
          </div>
        </div>

        {/* Cashback/Reward Wallet */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-400 font-mono">Cashback Wallet</span>
            <div className="p-2 bg-amber-950/60 rounded-xl text-amber-400 border border-amber-900/50">
              <Coins className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-amber-400">${cashbackBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="mt-4 pt-4 border-t border-slate-850 flex justify-between text-[10px] font-mono text-slate-500">
            <span>Promotional loyalty drops</span>
            <span className="text-amber-400 font-semibold uppercase">ACTIVE REWARDS</span>
          </div>
        </div>

      </div>

      {/* Sec 3: Core Airtime module & Side Logs View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Core Form Left Panel */}
        <div className="lg:col-span-8 bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              <span>Instant Airtime Top-Up</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">Enter a destination number to automatically query prefix catalogs.</p>
          </div>

          <form onSubmit={triggerRechargeFlow} className="space-y-6">
            
            {/* Phone Number Input & Auto-detect Label */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Recipient Mobile Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={recipientNumber}
                    onChange={(e) => setRecipientNumber(e.target.value)}
                    placeholder="e.g., 01755512345"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Operator detector display */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Resolved Network Carrier</label>
                <div className={`rounded-xl border p-2.5 flex items-center justify-between h-[38px] ${
                  detectedOperator 
                    ? detectedOperator.color 
                    : 'border-slate-850 bg-slate-950 text-slate-500 font-mono text-xs'
                }`}>
                  {detectedOperator ? (
                    <>
                      <span className="text-xs font-semibold uppercase">{detectedOperator.name}</span>
                      <span className="text-[10px] font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850">PREFIX MATCH</span>
                    </>
                  ) : (
                    <span className="text-[10px]">Awaiting number prefixes...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Prepaid / Postpaid toggle */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Recharge Line Classification</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsPostpaid(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    !isPostpaid 
                      ? 'bg-indigo-950 text-indigo-400 border-indigo-800' 
                      : 'bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-900'
                  }`}
                >
                  PREPAID CONNECTION
                </button>
                <button
                  type="button"
                  onClick={() => setIsPostpaid(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isPostpaid 
                      ? 'bg-indigo-950 text-indigo-400 border-indigo-800' 
                      : 'bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-900'
                  }`}
                >
                  POSTPAID CONNECTION
                </button>
              </div>
            </div>

            {/* Structured Package Catalogs */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Structured Carrier Tariff Bundles (Optional)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {packages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleSelectPackage(pkg)}
                      className={`p-3.5 rounded-xl border text-left flex justify-between items-start gap-3 transition-all ${
                        isSelected 
                          ? 'bg-slate-900 text-white border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.08)]' 
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            pkg.type === 'DATA' ? 'bg-sky-950 text-sky-400 border border-sky-900/50' :
                            pkg.type === 'COMBO' ? 'bg-purple-950 text-purple-400 border border-purple-900/50' :
                            'bg-amber-950 text-amber-400 border border-amber-900/50'
                          }`}>
                            {pkg.type}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-200 truncate">{pkg.name}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 line-clamp-1">{pkg.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-bold font-mono text-indigo-400">${pkg.price}</span>
                        <span className="block text-[9px] text-slate-500 mt-0.5">{pkg.validity}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Custom Payout Amount (USD)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={rechargeAmount}
                    onChange={(e) => {
                      setRechargeAmount(e.target.value);
                      setSelectedPackage(null); // break binding
                    }}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Client Transaction Reference ID</label>
                <input
                  type="text"
                  value={clientReference}
                  onChange={(e) => setClientReference(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs font-mono text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Interactive State-Machine Monitor Console */}
            {rechargeStatus !== 'IDLE' && (
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">NESTJS BACKEND PROCESS TICKER</span>
                  <span className="text-indigo-400 animate-pulse">● ACTIVE ENGINE</span>
                </div>
                
                <div className="space-y-2">
                  {/* Step 1 */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${
                      rechargeStatus !== 'IDLE' ? 'text-teal-400' : 'text-slate-700'
                    }`} />
                    <span className={rechargeStatus === 'BALANCE_CHECK' ? 'text-indigo-400 font-bold animate-pulse' : 'text-slate-300'}>
                      ASSERT_WALLET_BALANCE_CHECK (Phone: {recipientNumber || 'Pending'})
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${
                      rechargeStatus !== 'IDLE' && rechargeStatus !== 'BALANCE_CHECK' ? 'text-teal-400' : 'text-slate-700'
                    }`} />
                    <span className={rechargeStatus === 'DEBIT_LOCK' ? 'text-indigo-400 font-bold animate-pulse' : 'text-slate-400'}>
                      ACQUIRE_FOR_UPDATE_ROW_LOCK & PRE_DEBIT_BALANCES
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${
                      rechargeStatus === 'QUEUED' || rechargeStatus === 'PROCESSING' || rechargeStatus === 'SUCCESS' ? 'text-teal-400' : 'text-slate-700'
                    }`} />
                    <span className={rechargeStatus === 'QUEUED' ? 'text-indigo-400 font-bold animate-pulse' : 'text-slate-400'}>
                      DISPATCH_TO_BULLMQ_ASYNC_PROCESSING_QUEUES (Status: QUEUED)
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${
                      rechargeStatus === 'PROCESSING' || rechargeStatus === 'SUCCESS' ? 'text-teal-400' : 'text-slate-700'
                    }`} />
                    <span className={rechargeStatus === 'PROCESSING' ? 'text-indigo-400 font-bold animate-pulse' : 'text-slate-400'}>
                      BROKER_OPERATOR_GATEWAY_HANDSHAKE_SLA (Latency: 450ms)
                    </span>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${
                      rechargeStatus === 'SUCCESS' ? 'text-teal-400' : 'text-slate-700'
                    }`} />
                    <span className={rechargeStatus === 'SUCCESS' ? 'text-teal-400 font-bold' : 'text-slate-400'}>
                      DISTRIBUTE_HIERARCHICAL_COMMISSIONS_&_COMMIT (Status: SUCCESS)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Execution button */}
            <button
              type="submit"
              disabled={rechargeStatus === 'BALANCE_CHECK' || rechargeStatus === 'DEBIT_LOCK' || rechargeStatus === 'QUEUED' || rechargeStatus === 'PROCESSING'}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Radio className="h-4 w-4" />
              <span>EXECUTE SECURE RECHARGE TRANSMISSION</span>
            </button>

          </form>
        </div>

        {/* Live Logs Right Panel */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between h-fit lg:h-full">
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Live Node Audits</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Chronological transaction logs</p>
              </div>
              <Clock className="h-4 w-4 text-slate-500" />
            </div>

            <div className="space-y-3.5">
              {rechargeLog.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{log.id}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-rose-950 text-rose-400 border border-rose-900/40'
                    }`}>
                      {log.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-semibold">{log.number}</span>
                    <span className="text-white font-bold">${log.amount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>{log.operator}</span>
                    <span>{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-850">
            <a 
              href="/dashboard/recharges"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1.5 w-full bg-indigo-950/20 py-2.5 rounded-xl border border-indigo-900/40"
            >
              <span>View Extended Ledger Logs</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
