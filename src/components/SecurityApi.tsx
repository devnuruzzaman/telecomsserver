import React, { useState } from 'react';
import { API_GROUPS } from '../data';
import { APIEndpoint, APIGroup } from '../types';
import { 
  ShieldAlert, ShieldCheck, Key, RefreshCw, Send, Check, 
  Layers, Terminal, AppWindow, Copy, FileCode, CheckSquare
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SecurityApi() {
  const [selectedGroup, setSelectedGroup] = useState<string>(API_GROUPS[0].groupName);
  const [selectedEndpointPath, setSelectedEndpointPath] = useState<string>(API_GROUPS[0].endpoints[0].path);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeGroup = API_GROUPS.find(g => g.groupName === selectedGroup) || API_GROUPS[0];
  const activeEndpoint = activeGroup.endpoints.find(e => e.path === selectedEndpointPath) || activeGroup.endpoints[0];

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const securityPolicies = [
    { title: 'OWASP Protection', desc: 'Secure Express security headers mapping (Helmet), CORS whitelists, and automated input validation rules using class-validator.' },
    { title: 'Double-Entry Isolation', desc: 'Financial transaction operations wrap in isolated PostgreSQL transaction blocks featuring strict (FOR UPDATE) locking.' },
    { title: 'Rate Limiting Core', desc: 'Nginx and Redis combined. Throttles high-frequency bulk requests to avoid volumetric API abuse.' },
    { title: 'Asymmetric JWT Security', desc: 'Authenticates and rotates keys using RSA asymmetric RS256 algorithm with strict signature validations.' }
  ];

  return (
    <div className="space-y-8" id="security-tab-content">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white font-display">Security & API Specifications</h2>
          </div>
          <p className="text-sm text-slate-400">
            A secure integration blueprint outlining system security policies, cryptographic checks, and REST API structures.
          </p>
        </div>
      </div>

      {/* Security Principles Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityPolicies.map((p, i) => (
          <div key={i} className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-xl space-y-3 hover:border-slate-700/60 transition-colors">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <ShieldAlert className="h-4.5 w-4.5 text-indigo-400" />
              <span>{p.title}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* REST API Explorer */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* API Endpoint Selector */}
        <div className="xl:col-span-1 space-y-5">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Versioned REST Groups</span>
          <div className="space-y-4">
            {API_GROUPS.map((group) => (
              <div key={group.groupName} className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">{group.groupName}</span>
                <div className="space-y-1">
                  {group.endpoints.map((ep) => {
                    const isSelected = selectedEndpointPath === ep.path && selectedGroup === group.groupName;
                    const methodColor = ep.method === 'POST' ? 'text-indigo-400 bg-indigo-950/40 border-indigo-900/50' : 'text-teal-400 bg-teal-950/40 border-teal-900/50';
                    return (
                      <button
                        key={ep.path}
                        onClick={() => {
                          setSelectedGroup(group.groupName);
                          setSelectedEndpointPath(ep.path);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-slate-900 border-indigo-800/80 text-white'
                            : 'bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900/10 hover:text-slate-200'
                        }`}
                      >
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${methodColor}`}>
                          {ep.method}
                        </span>
                        <span className="font-mono text-[10px] truncate">{ep.path}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Endpoint Specs */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-4 right-4 font-mono text-[10px] text-slate-600">REST_ENDPOINT</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  activeEndpoint.method === 'POST' ? 'text-indigo-400 bg-indigo-950/40 border-indigo-900/50' : 'text-teal-400 bg-teal-950/40 border-teal-900/50'
                }`}>
                  {activeEndpoint.method}
                </span>
                <span className="font-mono text-sm text-white font-semibold">{activeEndpoint.path}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{activeEndpoint.description}</p>
            </div>
          </div>

          {/* Request Headers */}
          {activeEndpoint.requestHeaders && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Required Request Headers</span>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1">
                {Object.entries(activeEndpoint.requestHeaders).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    <span className="text-teal-400 font-semibold">{k}:</span>
                    <span className="text-slate-400">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request / Response JSON Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Body */}
            {activeEndpoint.requestBody && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Payload Request Body</span>
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center bg-slate-900/40 border-b border-slate-850 px-4 py-2">
                    <span className="text-[10px] font-mono text-slate-400">JSON</span>
                    <button
                      onClick={() => handleCopy(activeEndpoint.requestBody || '', 'req')}
                      className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'req' ? <Check className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'req' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-[250px] custom-scrollbar bg-slate-950">
                    <code>{activeEndpoint.requestBody}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Response 200 */}
            {activeEndpoint.responseBody200 && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Response Success (200 OK)</span>
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center bg-slate-900/40 border-b border-slate-850 px-4 py-2">
                    <span className="text-[10px] font-mono text-emerald-400">JSON</span>
                    <button
                      onClick={() => handleCopy(activeEndpoint.responseBody200 || '', 'res200')}
                      className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'res200' ? <Check className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'res200' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-[250px] custom-scrollbar bg-slate-950">
                    <code>{activeEndpoint.responseBody200}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
