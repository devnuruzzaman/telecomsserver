import React, { useState } from 'react';
import { FILE_STRUCTURE } from '../data';
import { FolderNode } from '../types';
import { 
  Folder, FolderOpen, FileCode, ChevronDown, ChevronRight, 
  Terminal, ShieldCheck, Copy, Check, FileText, Settings, AppWindow
} from 'lucide-react';
import { motion } from 'motion/react';

export default function FolderStructure() {
  const [selectedFile, setSelectedFile] = useState<FolderNode | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    './backend-nestjs': true,
    './backend-nestjs/prisma': true,
    './backend-nestjs/src': true,
    './frontend-nextjs': true,
    './frontend-nextjs/src': true
  });
  const [copied, setCopied] = useState<boolean>(false);

  // Initialize with a default file to show
  React.useEffect(() => {
    // Find the schema.prisma node inside FILE_STRUCTURE to show as default
    const findPrismaSchema = (node: FolderNode): FolderNode | null => {
      if (node.name === 'schema.prisma') return node;
      if (node.children) {
        for (const child of node.children) {
          const res = findPrismaSchema(child);
          if (res) return res;
        }
      }
      return null;
    };
    const defaultNode = findPrismaSchema(FILE_STRUCTURE);
    if (defaultNode) setSelectedFile(defaultNode);
  }, []);

  const toggleDir = (path: string) => {
    setExpandedDirs(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Recursive component to render folders
  const RenderNode = ({ node, depth = 0 }: { node: FolderNode; depth: number; key?: React.Key | number }) => {
    const isDir = node.type === 'directory';
    const isExpanded = expandedDirs[node.path];
    const isFileSelected = selectedFile?.path === node.path;

    return (
      <div className="select-none font-mono text-xs">
        <div 
          onClick={() => {
            if (isDir) {
              toggleDir(node.path);
            } else {
              setSelectedFile(node);
            }
          }}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          className={`group flex items-center gap-2 py-1.5 pr-2 rounded-lg cursor-pointer transition-colors ${
            isDir 
              ? 'text-slate-300 hover:bg-slate-900/30' 
              : isFileSelected
                ? 'text-indigo-400 bg-indigo-950/40 font-semibold border-l-2 border-indigo-500 rounded-l-none'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/10'
          }`}
        >
          {isDir ? (
            <span className="text-slate-500">
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
          ) : (
            <span className="w-3.5" /> // spacing spacer
          )}

          {isDir ? (
            isExpanded ? <FolderOpen className="h-4 w-4 text-amber-500/80 shrink-0" /> : <Folder className="h-4 w-4 text-amber-600/80 shrink-0" />
          ) : (
            <FileCode className={`h-4 w-4 shrink-0 ${isFileSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
          )}

          <span className="truncate">{node.name}</span>
        </div>

        {isDir && isExpanded && node.children && (
          <div className="mt-0.5">
            {node.children.map((child, idx) => (
              <RenderNode key={idx} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8" id="folder-tab-content">
      {/* Overview Intro */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white font-display">Enterprise Unified Codebase Structure</h2>
        </div>
        <p className="text-sm text-slate-400">
          Explore the production-grade directory layout of the unified repository. Click on individual files to view their architectural scope, responsibilities, and sample code templates.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* File Tree Explorer (Left) */}
        <div className="xl:col-span-1 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono pb-3 border-b border-slate-850 mb-3 px-2">
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Mono-Repo Structure</span>
          </div>
          <div className="space-y-1">
            <RenderNode node={FILE_STRUCTURE} depth={0} />
          </div>
        </div>

        {/* Selected File Scope (Right) */}
        <div className="xl:col-span-2 space-y-6">
          {selectedFile ? (
            <div className="space-y-6">
              {/* File details card */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-4 right-4 font-mono text-[10px] text-slate-600">FILE_COMPLIANCE</div>
                <div className="space-y-2">
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/50">
                    {selectedFile.path.includes('backend') ? 'NestJS Backend Layer' : 'Next.js Frontend Layer'}
                  </span>
                  <h3 className="text-xl font-bold font-mono text-white mt-2">{selectedFile.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{selectedFile.description}</p>
                </div>
              </div>

              {/* Blueprint Content */}
              {selectedFile.blueprintContent ? (
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center bg-slate-900/60 border-b border-slate-800/80 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      <span className="text-xs font-mono text-slate-400">Architectural Code Template</span>
                    </div>
                    <button
                      onClick={() => handleCopy(selectedFile.blueprintContent || '')}
                      className="text-xs font-mono text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded bg-indigo-950/40 border border-indigo-900/50 hover:bg-indigo-950/60 cursor-pointer flex items-center gap-1.5"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : null}
                      {copied ? 'Copied' : 'Copy Template'}
                    </button>
                  </div>
                  <pre className="p-5 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[380px] custom-scrollbar bg-slate-950">
                    <code>{selectedFile.blueprintContent}</code>
                  </pre>
                </div>
              ) : (
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-3">
                  <FileText className="h-10 w-10 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">Declarative File Configured</p>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    This file is programmatically defined in the enterprise architecture. Its code structure matches the standard production boilerplate configuration details.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-20 flex flex-col items-center justify-center text-center space-y-3">
              <Terminal className="h-10 w-10 text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">Select a File to View Blueprint</p>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Click on any code file in the mono-repo directory explorer to inspect modular details, routing pathways, and schema configurations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
