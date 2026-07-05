'use client';

import React, { useState } from 'react';
import { 
  Coins, Wallet, RefreshCw, Send, CheckCircle2, AlertTriangle, HelpCircle, 
  ArrowDownLeft, ArrowUpRight, Plus, Landmark, History 
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'COMMISSION';
  amount: number;
  previousBalance: number;
  currentBalance: number;
  purpose: string;
  date: string;
  reference: string;
}

export default function WalletPage() {
  const [mainBalance, setMainBalance] = useState(12450.00);
  const [commissionBalance, setCommissionBalance] = useState(248.50);

  // Transfer form state
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [securityPasscode, setSecurityPasscode] = useState('');
  const [transferStatus, setTransferStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [transferMessage, setTransferMessage] = useState('');

  // Top up portal state
  const [topupAmount, setTopupAmount] = useState('500');
  const [selectedMethod, setSelectedMethod] = useState<'CARD' | 'BANK' | 'MOBILE'>('BANK');
  const [topupStatus, setTopupStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS'>('IDLE');

  const [ledger, setLedger] = useState<LedgerEntry[]>([
    { id: 'TXN-00981', type: 'DEBIT', amount: 15.00, previousBalance: 12465.00, currentBalance: 12450.00, purpose: 'RECHARGE_OUTGOING', date: '2026-07-05 11:32:00', reference: 'REC-99041' },
    { id: 'TXN-00980', type: 'COMMISSION', amount: 0.30, previousBalance: 248.20, currentBalance: 248.50, purpose: 'COMMISSION_EARNED', date: '2026-07-05 11:32:00', reference: 'REC-99041' },
    { id: 'TXN-00979', type: 'DEBIT', amount: 20.00, previousBalance: 12485.00, currentBalance: 12465.00, purpose: 'RECHARGE_OUTGOING', date: '2026-07-05 11:20:15', reference: 'REC-99040' },
    { id: 'TXN-00978', type: 'COMMISSION', amount: 0.40, previousBalance: 247.80, currentBalance: 248.20, purpose: 'COMMISSION_EARNED', date: '2026-07-05 11:20:15', reference: 'REC-99040' },
    { id: 'TXN-00977', type: 'CREDIT', amount: 2500.00, previousBalance: 9985.00, currentBalance: 12485.00, purpose: 'LEDGER_LOAD_BANK', date: '2026-07-04 15:00:00', reference: 'BANK_DEP_990142' }
  ]);

  const handleP2PTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);

    if (!transferTarget) {
      alert('Specify target recipient ID');
      return;
    }

    if (amount > mainBalance) {
      setTransferStatus('FAILED');
      setTransferMessage('Transfer failed: Insufficient standard credit inside your main wallet.');
      return;
    }

    if (securityPasscode !== '1234') {
      setTransferStatus('FAILED');
      setTransferMessage('Transfer failed: Invalid 4-digit security PIN.');
      return;
    }

    setTransferStatus('LOADING');
    setTransferMessage('Acquiring DB locks & dispatching transfer request...');

    setTimeout(() => {
      setTransferStatus('SUCCESS');
      setTransferMessage(`Successfully transferred $${amount.toFixed(2)} to merchant account ${transferTarget}.`);
      setMainBalance(prev => prev - amount);

      // Add to ledger
      const newEntry: LedgerEntry = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'TRANSFER',
        amount: amount,
        previousBalance: mainBalance,
        currentBalance: mainBalance - amount,
        purpose: `P2P_TRANSFER_TO_${transferTarget.toUpperCase()}`,
        date: 'Just Now',
        reference: `P2P_${Math.floor(100000 + Math.random() * 900000)}`
      };
      setLedger(prev => [newEntry, ...prev]);

      // Reset
      setTransferTarget('');
      setTransferAmount('');
      setSecurityPasscode('');
    }, 1500);
  };

  const handleLoadFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topupAmount);

    setTopupStatus('LOADING');

    setTimeout(() => {
      setTopupStatus('SUCCESS');
      setMainBalance(prev => prev + amount);

      // Add ledger
      const newEntry: LedgerEntry = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'CREDIT',
        amount: amount,
        previousBalance: mainBalance,
        currentBalance: mainBalance + amount,
        purpose: `LEDGER_LOAD_${selectedMethod}`,
        date: 'Just Now',
        reference: `GATEWAY_${Math.floor(100000 + Math.random() * 900000)}`
      };
      setLedger(prev => [newEntry, ...prev]);

      setTimeout(() => {
        setTopupStatus('IDLE');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8" id="wallet-ledger-view">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-white">Wallet Ledger</h1>
        <p className="text-xs text-slate-400 mt-1">Audit-compliant financial vaults and automated double-entry ledgering.</p>
      </div>

      {/* Main Grid: Left is Transfers and Topups, Right is Ledger History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Core Actions Left */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Action 1: P2P Distributor Transfer */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="h-4.5 w-4.5 text-indigo-400" />
                <span>P2P Balance Transfer</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Disperse wholesale credit instantly to downstream agents.</p>
            </div>

            {transferStatus !== 'IDLE' && (
              <div className={`p-3 rounded-xl flex items-start gap-2.5 text-xs ${
                transferStatus === 'SUCCESS' ? 'bg-emerald-950/20 border border-emerald-900/40 text-emerald-400' :
                transferStatus === 'FAILED' ? 'bg-rose-950/20 border border-rose-900/40 text-rose-400' :
                'bg-slate-950 border border-slate-850 text-slate-300 font-mono animate-pulse'
              }`}>
                {transferStatus === 'SUCCESS' ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
                <span>{transferMessage}</span>
              </div>
            )}

            <form onSubmit={handleP2PTransfer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Recipient ID or Phone</label>
                <input
                  type="text"
                  required
                  value={transferTarget}
                  onChange={(e) => setTransferTarget(e.target.value)}
                  placeholder="e.g. AGENT-9912A"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Transfer Credit (USD)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="e.g. 250.00"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">4-Digit Security PIN</label>
                  <span className="text-[9px] font-mono text-slate-500">Default: <code className="bg-slate-950 px-1 rounded">1234</code></span>
                </div>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={securityPasscode}
                  onChange={(e) => setSecurityPasscode(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs text-center tracking-[0.5em] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={transferStatus === 'LOADING'}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
              >
                {transferStatus === 'LOADING' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>Disperse Wholesale Credit</span>
              </button>
            </form>
          </div>

          {/* Action 2: Load Funds Portal */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Landmark className="h-4.5 w-4.5 text-teal-400" />
                <span>Load Wallet Balance</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Replenish your balance via integrated bank wires or credit card channels.</p>
            </div>

            <form onSubmit={handleLoadFunds} className="space-y-4">
              {/* Load Methods */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-850">
                {(['CARD', 'BANK', 'MOBILE'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all ${
                      selectedMethod === method 
                        ? 'bg-teal-600 text-white shadow' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Reload Amount (USD)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={topupStatus === 'LOADING'}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(13,148,136,0.2)]"
              >
                {topupStatus === 'LOADING' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Initiate Gateway Deposit</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Double-entry Ledger History Right */}
        <div className="lg:col-span-7 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-slate-850 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-indigo-400" />
                <span>Double-Entry General Ledger</span>
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Chronological record of double-entry assets</p>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-indigo-950 border border-indigo-900/50 text-indigo-400 rounded-full font-bold">PCI-DSS SECURITY LOCK</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-900 scrollbar">
            {ledger.map((entry) => (
              <div key={entry.id} className="p-4 bg-slate-950/20 hover:bg-slate-950/60 transition-colors flex items-center justify-between gap-4">
                
                {/* Visual Icon indicator */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border shrink-0 ${
                    entry.type === 'CREDIT' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' :
                    entry.type === 'DEBIT' ? 'bg-rose-950/40 text-rose-400 border-rose-900/30' :
                    'bg-indigo-950/40 text-indigo-400 border-indigo-900/30'
                  }`}>
                    {entry.type === 'CREDIT' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-200 font-mono">{entry.purpose}</span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{entry.date} · Ref: <strong className="text-slate-400 font-semibold">{entry.reference}</strong></span>
                  </div>
                </div>

                {/* Balance records */}
                <div className="text-right font-mono">
                  <span className={`block text-xs font-extrabold ${
                    entry.type === 'CREDIT' || entry.type === 'COMMISSION' ? 'text-teal-400' : 'text-slate-200'
                  }`}>
                    {entry.type === 'CREDIT' || entry.type === 'COMMISSION' ? '+' : '-'}${entry.amount.toFixed(2)}
                  </span>
                  <span className="block text-[9px] text-slate-500 mt-0.5">Bal: ${entry.currentBalance.toFixed(2)}</span>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
