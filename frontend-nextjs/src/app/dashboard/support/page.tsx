'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, MessageSquare, Plus, Clock, Search, Send, UserCheck, 
  CheckCircle2, RefreshCw, Radio, Sparkles 
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  category: 'RECHARGE_DELAY' | 'API_INTEGRATION' | 'LEDGER_DISPUTE' | 'KYC_ASSIST';
  lastUpdated: string;
  messages: Array<{ sender: 'MERCHANT' | 'SUPPORT_AGENT'; text: string; time: string }>;
}

export default function SupportPage() {
  const [activeTicketId, setActiveTicketId] = useState<string>('TKT-8801');
  const [typedMessage, setTypedMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-8801',
      subject: 'Failed Top-up Balance lock dispute - ROBI Axiata',
      status: 'IN_PROGRESS',
      category: 'RECHARGE_DELAY',
      lastUpdated: '5 mins ago',
      messages: [
        { sender: 'MERCHANT', text: 'Hi, I dispatched a $20.00 recharge to number +8801811122233. The ledger debited but the client claims the top-up was never delivered. Reference REC-99040.', time: '10 mins ago' },
        { sender: 'SUPPORT_AGENT', text: 'Greeting from RechargeSaaS Support. We have queried the operator queue. It looks like Robi Axiata experienced a gateway timeout but subsequently auto-refunded. We are checking the general ledger to verify if your refund was dispatched.', time: '5 mins ago' }
      ]
    },
    {
      id: 'TKT-8802',
      subject: 'Next.js App Router API connection latency guidelines',
      status: 'OPEN',
      category: 'API_INTEGRATION',
      lastUpdated: '1 hour ago',
      messages: [
        { sender: 'MERCHANT', text: 'What is the recommended timeout duration when requesting the billing/execute endpoint from client edge nodes?', time: '1 hour ago' }
      ]
    },
    {
      id: 'TKT-8803',
      subject: 'Merchant agent KYC documentation upload validation',
      status: 'RESOLVED',
      category: 'KYC_ASSIST',
      lastUpdated: 'Yesterday',
      messages: [
        { sender: 'MERCHANT', text: 'I submitted the national identity document copies for retailer ID cfa8bc04. Please expedite approval.', time: 'Yesterday' },
        { sender: 'SUPPORT_AGENT', text: 'Document validation approved. Retailer account cfa8bc04 is now fully authenticated with transaction limit caps raised to $10,000 daily.', time: 'Yesterday' }
      ]
    }
  ]);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeTicket) return;

    const newMessage = {
      sender: 'MERCHANT' as const,
      text: typedMessage,
      time: 'Just Now'
    };

    // Update active ticket messages
    setTickets(prev => prev.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          lastUpdated: 'Just Now',
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));

    setTypedMessage('');

    // Simulate supportive automated agent responses after 1.5 seconds
    setTimeout(() => {
      const supportReply = {
        sender: 'SUPPORT_AGENT' as const,
        text: `Logged. The technical staff is looking into your message regarding this ticket. Standard response latency is 5 to 10 minutes.`,
        time: 'Just Now'
      };

      setTickets(prev => prev.map(t => {
        if (t.id === activeTicket.id) {
          return {
            ...t,
            lastUpdated: 'Just Now',
            messages: [...t.messages, supportReply]
          };
        }
        return t;
      }));
    }, 1500);
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8" id="support-helpdesk-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">Support Help Desk</h1>
          <p className="text-xs text-slate-400 mt-1">Resolve transaction disputes, compliance delays, or integration bugs.</p>
        </div>

        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
          <Plus className="h-4 w-4" />
          <span>Raise Security Ticket</span>
        </button>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[550px] items-stretch">
        
        {/* Ticket List Left Panel */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col min-h-0 overflow-hidden">
          
          {/* Search tickets */}
          <div className="p-4 border-b border-slate-850 shrink-0">
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 h-4 w-4 mt-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket threads..."
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Chronological list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-900 scrollbar">
            {filteredTickets.map((t) => {
              const isActive = t.id === activeTicketId;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`w-full p-4 text-left hover:bg-slate-950/40 transition-colors flex flex-col gap-2.5 ${
                    isActive ? 'bg-slate-950/80 border-l-2 border-indigo-500' : 'bg-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center w-full text-xs font-mono">
                    <span className="font-bold text-slate-400">{t.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      t.status === 'OPEN' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/40' :
                      t.status === 'IN_PROGRESS' ? 'bg-amber-950 text-amber-400 border border-amber-900/40' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-900/40'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{t.subject}</h4>

                  <div className="flex justify-between items-center w-full text-[10px] font-mono text-slate-500">
                    <span>Category: {t.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t.lastUpdated}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Messaging Box Panel Right */}
        <div className="lg:col-span-8 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col min-h-0 overflow-hidden">
          {activeTicket ? (
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Box Header */}
              <div className="p-4 bg-slate-950/60 border-b border-slate-850 flex justify-between items-center shrink-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">{activeTicket.id} · Helpdesk Thread</span>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{activeTicket.subject}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  <span>Support Online</span>
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar">
                {activeTicket.messages.map((m, idx) => {
                  const isMerchant = m.sender === 'MERCHANT';
                  return (
                    <div 
                      key={idx}
                      className={`flex flex-col max-w-[80%] ${
                        isMerchant ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        isMerchant 
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-[0_2px_8px_rgba(99,102,241,0.25)]' 
                          : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none'
                      }`}>
                        <p>{m.text}</p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-1">{m.sender === 'MERCHANT' ? 'You' : 'Support Desk'} · {m.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Input text sender */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-850 bg-slate-950/40 shrink-0 flex gap-3">
                <input
                  type="text"
                  required
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type a compliance response message..."
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
              <MessageSquare className="h-10 w-10 text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 font-mono">Select a ticket from the left panel to begin discussion.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
