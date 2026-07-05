'use client';

import React, { useState } from 'react';
import { 
  Smartphone, Search, Filter, ArrowUpRight, CheckCircle2, XCircle, 
  Clock, ShieldAlert, Terminal, Eye, Copy, Check 
} from 'lucide-react';

interface RechargeLog {
  id: string;
  recipient: string;
  operator: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'QUEUED' | 'REFUNDED';
  commission: number;
  date: string;
  reference: string;
  apiPayload: {
    request: string;
    response: string;
  };
}

export default function RechargeLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [operatorFilter, setOperatorFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<RechargeLog | null>(null);
  const [copied, setCopied] = useState(false);

  const logs: RechargeLog[] = [
    {
      id: 'REC-99041',
      recipient: '+8801755512345',
      operator: 'Grameenphone',
      amount: 15.00,
      status: 'SUCCESS',
      commission: 0.30,
      date: '2026-07-05 11:32:00',
      reference: 'RECH_SANDBOX_01',
      apiPayload: {
        request: `{ "recipient_number": "+8801755512345", "operator_id": "GP-01", "amount": 15.00, "client_reference": "RECH_SANDBOX_01" }`,
        response: `{ "recharge_id": "REC-99041", "status": "SUCCESS", "recipient": "+8801755512345", "deducted_balance": 15.00, "commission_earned": 0.30, "operator_ref": "GP_NET_09912A" }`
      }
    },
    {
      id: 'REC-99040',
      recipient: '+8801811122233',
      operator: 'Robi Axiata',
      amount: 20.00,
      status: 'SUCCESS',
      commission: 0.40,
      date: '2026-07-05 11:20:15',
      reference: 'RECH_SANDBOX_02',
      apiPayload: {
        request: `{ "recipient_number": "+8801811122233", "operator_id": "ROBI-01", "amount": 20.00, "client_reference": "RECH_SANDBOX_02" }`,
        response: `{ "recharge_id": "REC-99040", "status": "SUCCESS", "recipient": "+8801811122233", "deducted_balance": 20.00, "commission_earned": 0.40, "operator_ref": "ROBI_NET_12A99" }`
      }
    },
    {
      id: 'REC-99039',
      recipient: '+8801912345678',
      operator: 'Banglalink',
      amount: 50.00,
      status: 'FAILED',
      commission: 0.00,
      date: '2026-07-05 10:45:00',
      reference: 'RECH_SANDBOX_03',
      apiPayload: {
        request: `{ "recipient_number": "+8801912345678", "operator_id": "BL-01", "amount": 50.00, "client_reference": "RECH_SANDBOX_03" }`,
        response: `{ "statusCode": 400, "message": "Operator network handshake timed out after 3000ms.", "error": "Bad Request" }`
      }
    },
    {
      id: 'REC-99038',
      recipient: '+8801555111000',
      operator: 'Teletalk',
      amount: 10.00,
      status: 'REFUNDED',
      commission: 0.00,
      date: '2026-07-05 09:15:30',
      reference: 'RECH_SANDBOX_04',
      apiPayload: {
        request: `{ "recipient_number": "+8801555111000", "operator_id": "TELE-01", "amount": 10.00, "client_reference": "RECH_SANDBOX_04" }`,
        response: `{ "recharge_id": "REC-99038", "status": "REFUNDED", "reason": "Subscriber balance lock released due to network fail callback." }`
      }
    },
    {
      id: 'REC-99037',
      recipient: '+8801611223344',
      operator: 'Airtel Bangladesh',
      amount: 30.00,
      status: 'SUCCESS',
      commission: 0.60,
      date: '2026-07-04 18:30:12',
      reference: 'RECH_SANDBOX_05',
      apiPayload: {
        request: `{ "recipient_number": "+8801611223344", "operator_id": "AIRTEL-01", "amount": 30.00, "client_reference": "RECH_SANDBOX_05" }`,
        response: `{ "recharge_id": "REC-99037", "status": "SUCCESS", "recipient": "+8801611223344", "deducted_balance": 30.00, "commission_earned": 0.60, "operator_ref": "AIRTEL_NET_0219" }`
      }
    }
  ];

  // Filtering logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.recipient.includes(searchQuery) || log.id.toLowerCase().includes(searchQuery.toLowerCase()) || log.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchesOperator = operatorFilter === 'ALL' || log.operator === operatorFilter;
    return matchesSearch && matchesStatus && matchesOperator;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8" id="recharge-logs-view">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-white">Recharge Logs</h1>
        <p className="text-xs text-slate-400 mt-1">Audit-ready ledgers of cellular topups and network handshakes.</p>
      </div>

      {/* Filter and Search Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/30 border border-slate-900 p-4 rounded-2xl">
        {/* Search bar */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, recipient number, or reference..."
            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Filter className="h-3.5 w-3.5" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="QUEUED">Queued</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* Operator Filter */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Filter className="h-3.5 w-3.5" />
          </div>
          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="ALL">All Operators</option>
            <option value="Grameenphone">Grameenphone</option>
            <option value="Robi Axiata">Robi Axiata</option>
            <option value="Banglalink">Banglalink</option>
            <option value="Airtel Bangladesh">Airtel Bangladesh</option>
            <option value="Teletalk">Teletalk</option>
          </select>
        </div>
      </div>

      {/* Main Logs Table Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Table Listing Left */}
        <div className="lg:col-span-8 bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/60 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Log ID</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Operator</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Commission</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs text-slate-300 font-mono">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/15 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-400">{log.id}</td>
                      <td className="p-4 text-slate-200">{log.recipient}</td>
                      <td className="p-4">{log.operator}</td>
                      <td className="p-4 font-bold text-teal-400">${log.amount.toFixed(2)}</td>
                      <td className="p-4 text-indigo-400">${log.commission.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/40' :
                          log.status === 'FAILED' ? 'bg-rose-950/80 text-rose-400 border border-rose-900/40' :
                          log.status === 'QUEUED' ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-900/40' :
                          'bg-amber-950/80 text-amber-400 border border-amber-900/40'
                        }`}>
                          {log.status === 'SUCCESS' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 bg-slate-950 hover:bg-indigo-950 hover:text-indigo-400 border border-slate-850 rounded-lg text-slate-400 transition-colors"
                          title="Inspect API Handshake Payload"
                        >
                          <Terminal className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-mono text-xs">
                      No transactions match selected query criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Handshake Inspector Right */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col h-[520px]">
          <div className="border-b border-slate-850 pb-4 mb-4 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-sm font-bold text-white">Handshake Inspector</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Explore transactional API logs</p>
            </div>
            <Terminal className="h-4 w-4 text-indigo-400" />
          </div>

          {selectedLog ? (
            <div className="flex-1 flex flex-col min-h-0 space-y-4 font-mono text-[10px] leading-relaxed">
              {/* Header Details */}
              <div className="grid grid-cols-2 gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-850">
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">LOG REFERENCE</span>
                  <span className="text-slate-300 font-bold">{selectedLog.id}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">TIMESTAMP</span>
                  <span className="text-slate-300 font-bold">{selectedLog.date}</span>
                </div>
              </div>

              {/* Request Console */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center text-slate-500 mb-1">
                  <span>POST /v1/recharges/execute</span>
                  <button 
                    onClick={() => handleCopy(selectedLog.apiPayload.request)}
                    className="hover:text-white transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-3 overflow-y-auto text-slate-300 scrollbar">
                  <pre className="whitespace-pre-wrap">{selectedLog.apiPayload.request}</pre>
                </div>
              </div>

              {/* Response Console */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center text-slate-500 mb-1">
                  <span>SLA Response Body</span>
                  <button 
                    onClick={() => handleCopy(selectedLog.apiPayload.response)}
                    className="hover:text-white transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-3 overflow-y-auto text-emerald-400/90 scrollbar">
                  <pre className="whitespace-pre-wrap">{selectedLog.apiPayload.response}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
              <Eye className="h-8 w-8 text-slate-600 mb-2 animate-bounce" />
              <p className="text-xs text-slate-500 font-mono">
                Click the terminal icon on any table row to dissect the HTTP request and response handshakes.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
