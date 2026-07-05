import React, { useState } from 'react';
import { DB_SCHEMA } from '../data';
import { DBTable } from '../types';
import { 
  Database, Table, Key, Link2, Terminal, ShieldCheck, 
  Layers, Check, Copy, HelpCircle, GitCommit, FileText
} from 'lucide-react';
import { motion } from 'motion/react';

export default function DatabaseDesign() {
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dictionary' | 'diagram' | 'sql'>('dictionary');

  const currentTable = DB_SCHEMA.find(t => t.name === selectedTable) || DB_SCHEMA[0];

  // Helper to generate real SQL migration scripts for all database structures
  const generateSQLSchema = (): string => {
    let sql = `-- ========================================================\n`;
    sql += `-- ENTERPRISE TELECOM RECHARGE PLATFORM - DATABASE MIGRATION\n`;
    sql += `-- Target: PostgreSQL 16+, fully normalized, shadow auditable\n`;
    sql += `-- Generated: 2026-07-05 04:32:00Z\n`;
    sql += `-- ========================================================\n\n`;

    sql += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n`;

    DB_SCHEMA.forEach((table) => {
      sql += `-- Table Structure: ${table.name}\n`;
      sql += `CREATE TABLE "${table.name}" (\n`;
      const colLines = table.columns.map(col => {
        return `  "${col.name}" ${col.type} ${col.constraints}`.trim();
      });
      sql += colLines.join(',\n');
      sql += `\n);\n\n`;

      // Indexes
      table.indexes.forEach(idx => {
        sql += `-- Index: ${idx.name}\n`;
        sql += `CREATE INDEX "${idx.name}" ON "${table.name}" USING ${idx.type.toLowerCase()} (${idx.columns});\n`;
      });
      sql += `\n`;
    });

    sql += `-- ========================================================\n`;
    sql += `-- AUDITING TRIGGERS (Shadow Auditing Layer)\n`;
    sql += `-- ========================================================\n\n`;
    sql += `CREATE OR REPLACE FUNCTION log_wallet_update_audit()\n`;
    sql += `RETURNS TRIGGER AS $$\n`;
    sql += `BEGIN\n`;
    sql += `  INSERT INTO audit_logs (user_id, action, ip_address, old_values, new_values)\n`;
    sql += `  VALUES (\n`;
    sql += `    NEW.user_id, \n`;
    sql += `    'WALLET_BALANCE_ADJUST', \n`;
    sql += `    '127.0.0.1',\n`;
    sql += `    row_to_json(OLD),\n`;
    sql += `    row_to_json(NEW)\n`;
    sql += `  );\n`;
    sql += `  RETURN NEW;\n`;
    sql += `END;\n`;
    sql += `$$ LANGUAGE plpgsql;\n\n`;
    sql += `CREATE TRIGGER wallet_balance_audit_trigger\n`;
    sql += `AFTER UPDATE OF main_balance, commission_balance, cashback_balance ON wallets\n`;
    sql += `FOR EACH ROW EXECUTE FUNCTION log_wallet_update_audit();\n`;

    return sql;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSQLSchema());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8" id="database-tab-content">
      {/* Workspace Files Notice Banner */}
      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-900/30 rounded-lg text-emerald-400 mt-0.5 sm:mt-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Generated Files Available On Disk</span>
            <p className="text-xs text-slate-300 mt-1">
              Prisma and PostgreSQL schema blueprints have been physically generated in your workspace. You can reference them directly at <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-300 font-mono text-[11px]">/database/schema.prisma</code> and <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-300 font-mono text-[11px]">/database/schema.sql</code>.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800 px-2 py-1 rounded">PRISMA CLIENT READY</span>
          <span className="text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800 px-2 py-1 rounded">PG16 READY</span>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-display">Relational Database Core</h2>
          </div>
          <p className="text-sm text-slate-400">
            A fully normalized, shadow-audited database designed to support multi-tenant ledger entries with ACID safety guarantees.
          </p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 w-fit">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
              activeTab === 'dictionary'
                ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            Data Dictionary
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
              activeTab === 'diagram'
                ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            ER Relationship
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
              activeTab === 'sql'
                ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            Postgres DDL / SQL
          </button>
        </div>
      </div>

      {/* Dictionary Section */}
      {activeTab === 'dictionary' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Tables Selection List */}
          <div className="xl:col-span-1 space-y-3">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Active Tables</span>
            <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {DB_SCHEMA.map(table => (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    selectedTable === table.name
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                      : 'bg-slate-900/20 text-slate-400 border-slate-800/80 hover:bg-slate-900/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    <span className="font-mono text-xs">{table.name}</span>
                  </span>
                  <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 border border-slate-800 font-mono">
                    {table.columns.length} cols
                  </span>
                </button>
              ))}
            </div>
            
            <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg text-[11px] text-slate-500 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-400 font-mono">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>ACID ledger Integrity</span>
              </div>
              <p className="leading-relaxed">
                Platform uses strict transactional boundaries. Debits and commissions are guaranteed to either commit as a block or roll back, preventing balance discrepancies.
              </p>
            </div>
          </div>

          {/* Table Details */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-4 right-4 font-mono text-[10px] text-slate-600">POSTGRESQL_RELATION</div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-mono text-emerald-400">{currentTable.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{currentTable.description}</p>
              </div>
            </div>

            {/* Column Schema table */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-800/80 text-slate-400 font-mono">
                      <th className="p-4 font-semibold">Column Name</th>
                      <th className="p-4 font-semibold">Data Type</th>
                      <th className="p-4 font-semibold">Constraints</th>
                      <th className="p-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {currentTable.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/25 transition-colors">
                        <td className="p-4 text-emerald-400 font-semibold">{col.name}</td>
                        <td className="p-4 text-slate-300">{col.type}</td>
                        <td className="p-4 text-slate-400">
                          {col.constraints ? (
                            <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
                              {col.constraints}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-slate-500 font-sans leading-relaxed">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Indexes and Keys */}
            {currentTable.indexes.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Optimized Query Indexes</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTable.indexes.map((idx, indexId) => (
                    <div key={indexId} className="bg-slate-900/20 border border-slate-800/80 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-300 font-semibold">{idx.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-1.5 py-0.5 rounded">
                          {idx.type}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500">Columns: ({idx.columns})</p>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1 border-t border-slate-850/60">{idx.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ER Relationship diagram */}
      {activeTab === 'diagram' && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[420px] flex items-center justify-center relative overflow-x-auto">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Link2 className="h-3.5 w-3.5 text-emerald-500/80 animate-pulse" />
            <span>Schema Entity Relationship Layout</span>
          </div>

          <div className="flex gap-12 p-8 min-w-[900px]">
            {/* Table 1: Users */}
            <div className="w-[200px] shrink-0 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="bg-emerald-950/40 border-b border-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <Table className="h-3.5 w-3.5" />
                <span>users</span>
              </div>
              <div className="p-2.5 space-y-1 font-mono text-[10px] text-slate-400">
                <div className="flex justify-between text-white font-semibold"><span>id</span> <span className="text-emerald-500 font-bold">PK (UUID)</span></div>
                <div>email (VARCHAR)</div>
                <div>phone (VARCHAR)</div>
                <div>role (VARCHAR)</div>
                <div>kyc_status (VARCHAR)</div>
              </div>
            </div>

            {/* Line Connectors */}
            <div className="flex flex-col justify-center gap-16 text-slate-600 font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-8 bg-slate-700" />
                <span>1 : 1</span>
                <div className="h-[1px] w-8 bg-slate-700" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-8 bg-slate-700" />
                <span>1 : N</span>
                <div className="h-[1px] w-8 bg-slate-700" />
              </div>
            </div>

            {/* Mid Column: Wallets & Recharges */}
            <div className="flex flex-col gap-6">
              {/* Wallets */}
              <div className="w-[200px] bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-emerald-950/40 border-b border-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Table className="h-3.5 w-3.5" />
                  <span>wallets</span>
                </div>
                <div className="p-2.5 space-y-1 font-mono text-[10px] text-slate-400">
                  <div className="flex justify-between text-white font-semibold"><span>id</span> <span className="text-emerald-500">PK (UUID)</span></div>
                  <div className="flex justify-between text-emerald-400"><span>user_id</span> <span>FK</span></div>
                  <div>main_balance (DEC)</div>
                  <div>commission_balance</div>
                  <div>currency (VARCHAR)</div>
                </div>
              </div>

              {/* Recharges */}
              <div className="w-[200px] bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-emerald-950/40 border-b border-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Table className="h-3.5 w-3.5" />
                  <span>recharges</span>
                </div>
                <div className="p-2.5 space-y-1 font-mono text-[10px] text-slate-400">
                  <div className="flex justify-between text-white font-semibold"><span>id</span> <span className="text-emerald-500">PK (UUID)</span></div>
                  <div className="flex justify-between text-emerald-400"><span>user_id</span> <span>FK</span></div>
                  <div className="flex justify-between text-emerald-400"><span>operator_id</span> <span>FK</span></div>
                  <div>recipient_number</div>
                  <div>amount (DECIMAL)</div>
                  <div>status (VARCHAR)</div>
                </div>
              </div>
            </div>

            {/* Line Connectors 2 */}
            <div className="flex flex-col justify-center gap-16 text-slate-600 font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-8 bg-slate-700" />
                <span>1 : N</span>
                <div className="h-[1px] w-8 bg-slate-700" />
              </div>
            </div>

            {/* Third Column: Ledger Transactions */}
            <div className="flex flex-col justify-center">
              <div className="w-[200px] bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-emerald-950/40 border-b border-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Table className="h-3.5 w-3.5" />
                  <span>transactions</span>
                </div>
                <div className="p-2.5 space-y-1 font-mono text-[10px] text-slate-400">
                  <div className="flex justify-between text-white font-semibold"><span>id</span> <span className="text-emerald-500">PK (UUID)</span></div>
                  <div className="flex justify-between text-emerald-400"><span>wallet_id</span> <span>FK</span></div>
                  <div>type (CREDIT/DEBIT)</div>
                  <div>amount (DECIMAL)</div>
                  <div>previous_balance</div>
                  <div>current_balance</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Postgres Migration SQL schema tab */}
      {activeTab === 'sql' && (
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center bg-slate-900/60 border-b border-slate-800/80 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400">Production-Ready Migration DDL (PostgreSQL)</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded bg-emerald-950/40 border border-emerald-900/50 hover:bg-emerald-950/60 cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : null}
              {copied ? 'Copied' : 'Copy DDL script'}
            </button>
          </div>
          <pre className="p-5 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[400px] custom-scrollbar bg-slate-950">
            <code>{generateSQLSchema()}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
