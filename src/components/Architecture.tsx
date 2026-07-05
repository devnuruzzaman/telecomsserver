import React, { useState } from 'react';
import { TECH_STACK } from '../data';
import { 
  Network, Cpu, Database, Zap, Layers, Server, ShieldCheck, 
  Globe, ArrowRight, Laptop, HelpCircle, HardDrive, Check
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Architecture() {
  const [selectedNode, setSelectedNode] = useState<string>('nestjs');
  const [copied, setCopied] = useState<boolean>(false);

  // Core nodes in our enterprise topology diagram
  const topologyNodes = [
    { id: 'clients', label: 'Client Apps / APIs', icon: Laptop, x: 50, y: 150, color: 'text-sky-400 border-sky-800 bg-sky-950/40', desc: 'Next.js PWA, Mobile Apps, & REST Integrations' },
    { id: 'gateway', label: 'API Gateway (Nginx)', icon: Server, x: 250, y: 150, color: 'text-amber-400 border-amber-800 bg-amber-950/40', desc: 'Handles Rate Limiting, CORS, and SSL/TLS Termination' },
    { id: 'nestjs', label: 'NestJS Core Cluster', icon: Cpu, x: 480, y: 150, color: 'text-pink-400 border-pink-800 bg-pink-950/40', desc: 'Main Business Logic, Auth Guards, & Gateway Proxies' },
    { id: 'redis', label: 'Redis Cache Hub', icon: Zap, x: 480, y: 35, color: 'text-teal-400 border-teal-800 bg-teal-950/40', desc: 'Sub-millisecond caches & rate-limiting states' },
    { id: 'bullmq', label: 'BullMQ Job Queue', icon: Layers, x: 480, y: 265, color: 'text-indigo-400 border-indigo-800 bg-indigo-950/40', desc: 'Asynchronous workers processing recharge queues' },
    { id: 'postgres', label: 'Neon PostgreSQL (Prisma)', icon: Database, x: 720, y: 80, color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40', desc: 'ACID transactional ledger database for wallets' },
    { id: 'r2', label: 'Cloudflare R2 Storage', icon: HardDrive, x: 720, y: 220, color: 'text-orange-400 border-orange-800 bg-orange-950/40', desc: 'S3-compatible bucket storing KYC document scans' }
  ];

  const nodeMap: Record<string, typeof TECH_STACK[number] & { systemId: string }> = {
    clients: {
      systemId: 'clients',
      name: 'PWA & Client Applications',
      category: 'Client Services',
      description: 'Progressive Web App built in Next.js paired with mobile webviews and partner REST API connectors.',
      role: 'Interfacing with retail store owners, agents, and direct telecom consumers. Delivers instant user feedback on recharge operations.',
      scalingStrategy: 'Assets pre-built and cached at Edge CDN nodes. Features client-side state optimization for slow 3G environments.',
      iconName: 'Laptop',
      configSnippet: `// manifest.json (PWA configuration)\n{\n  "name": "Telecom Merchant Terminal",\n  "short_name": "RechargeSaaS",\n  "start_url": "/dashboard",\n  "display": "standalone",\n  "background_color": "#020617",\n  "theme_color": "#0f172a"\n}`
    },
    gateway: {
      systemId: 'gateway',
      name: 'Nginx API Gateway',
      category: 'Network & Security',
      description: 'High-performance reverse proxy routing incoming client traffic down internal service containers.',
      role: 'Intercepts HTTP requests, injects security headers, performs CORS handshakes, limits endpoint rate thresholds, and enforces IP whitelisting.',
      scalingStrategy: 'Horizontal IP scaling using Cloudflare DNS routing. Nginx caches standard static queries before they trigger NestJS instances.',
      iconName: 'Server',
      configSnippet: `# nginx.conf - Rate Limiting & SSL Routing\nlimit_req_zone $binary_remote_addr zone=api_limit:10m rate=15r/s;\n\nserver {\n  listen 443 ssl http2;\n  server_name api.telecom-saas.com;\n\n  location /api/v1/recharges/ {\n    limit_req zone=api_limit burst=20 nodelay;\n    proxy_pass http://nestjs_backend;\n    proxy_set_header Host $host;\n  }\n}`
    },
    nestjs: TECH_STACK.find(t => t.name.includes('NestJS')) ? { ...TECH_STACK.find(t => t.name.includes('NestJS'))!, systemId: 'nestjs' } : {
      systemId: 'nestjs',
      name: 'NestJS App Instance',
      category: 'Backend Core',
      description: 'Modular API Core parsing business flows, verifying wallets, and handshake processes.',
      role: 'Database triggers, transaction mapping, JWT operations, user RBAC audits.',
      scalingStrategy: 'Docker Swarm/Kubernetes replicas.',
      iconName: 'Cpu'
    },
    redis: TECH_STACK.find(t => t.name.includes('Redis')) ? { ...TECH_STACK.find(t => t.name.includes('Redis'))!, systemId: 'redis' } : {
      systemId: 'redis',
      name: 'Redis',
      category: 'Caching',
      description: 'Distributed cache.',
      role: 'Shared cache',
      scalingStrategy: 'Sentinel setup',
      iconName: 'Zap'
    },
    bullmq: TECH_STACK.find(t => t.name.includes('BullMQ')) ? { ...TECH_STACK.find(t => t.name.includes('BullMQ'))!, systemId: 'bullmq' } : {
      systemId: 'bullmq',
      name: 'BullMQ Queue Processor',
      category: 'Background Worker',
      description: 'Asynchronous workers.',
      role: 'Message queues',
      scalingStrategy: 'Dedicated nodes',
      iconName: 'Layers'
    },
    postgres: TECH_STACK.find(t => t.name.includes('PostgreSQL')) ? { ...TECH_STACK.find(t => t.name.includes('PostgreSQL'))!, systemId: 'postgres' } : {
      systemId: 'postgres',
      name: 'Neon PostgreSQL Database',
      category: 'Database System',
      description: 'Relational data engine.',
      role: 'Ledger record tracking.',
      scalingStrategy: 'Connection pools',
      iconName: 'Database'
    },
    r2: {
      systemId: 'r2',
      name: 'Cloudflare R2 Object Storage',
      category: 'Document Storage',
      description: 'Secure, cost-effective S3-compatible cloud storage lacking expensive egress bandwidth fees.',
      role: 'Hosts secure identification papers uploaded during retailer and agent KYC onboarding routines.',
      scalingStrategy: 'Backed by Cloudflare edge caching, distributing assets seamlessly with secure signed policies.',
      iconName: 'HardDrive',
      configSnippet: `// r2.service.ts - Presigned Upload Generation\nimport { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";\nimport { getSignedUrl } from "@aws-sdk/s3-request-presigner";\n\nconst r2Client = new S3Client({\n  region: "auto",\n  endpoint: \`https://\${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com\`,\n  credentials: {\n    accessKeyId: process.env.R2_ACCESS_KEY,\n    secretAccessKey: process.env.R2_SECRET_KEY\n  }\n});`
    }
  };

  const activeNode = nodeMap[selectedNode] || nodeMap.nestjs;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8" id="architecture-tab-content">
      {/* Intro */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white font-display">Enterprise Topology Map</h2>
        </div>
        <p className="text-sm text-slate-400">
          Click on any node in the topology map to browse system-level responsibilities, deployment patterns, and operational configurations.
        </p>
      </div>

      {/* Main Interactive Diagram Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Topology Visual */}
        <div className="xl:col-span-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 md:p-6 flex items-center justify-center min-h-[420px] relative overflow-x-auto">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Globe className="h-3.5 w-3.5 text-teal-500/80 animate-pulse" />
            <span>Active Network Flow Simulation</span>
          </div>

          <svg className="w-[820px] h-[300px] min-w-[820px]" viewBox="0 0 820 300">
            {/* Draw connectors first (so they stay behind nodes) */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
              </marker>
            </defs>

            {/* Clients -> Gateway */}
            <line x1="145" y1="150" x2="250" y2="150" stroke={selectedNode === 'clients' || selectedNode === 'gateway' ? '#6366f1' : '#334155'} strokeWidth="1.5" markerEnd="url(#arrow-active)" />
            
            {/* Gateway -> NestJS */}
            <line x1="345" y1="150" x2="480" y2="150" stroke={selectedNode === 'gateway' || selectedNode === 'nestjs' ? '#6366f1' : '#334155'} strokeWidth="1.5" markerEnd="url(#arrow-active)" />
            
            {/* NestJS -> Redis */}
            <line x1="480" y1="150" x2="480" y2="55" stroke={selectedNode === 'nestjs' || selectedNode === 'redis' ? '#2dd4bf' : '#334155'} strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* NestJS -> BullMQ */}
            <line x1="480" y1="150" x2="480" y2="245" stroke={selectedNode === 'nestjs' || selectedNode === 'bullmq' ? '#6366f1' : '#334155'} strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* NestJS -> PostgreSQL */}
            <line x1="575" y1="150" x2="720" y2="100" stroke={selectedNode === 'nestjs' || selectedNode === 'postgres' ? '#10b981' : '#334155'} strokeWidth="1.5" markerEnd="url(#arrow-active)" />
            
            {/* NestJS -> R2 */}
            <line x1="575" y1="150" x2="720" y2="200" stroke={selectedNode === 'nestjs' || selectedNode === 'r2' ? '#f97316' : '#334155'} strokeWidth="1.5" markerEnd="url(#arrow-active)" />

            {/* Interactive Nodes */}
            {topologyNodes.map((node) => {
              const IconComponent = node.icon;
              const isSelected = selectedNode === node.id;
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x - 65}, ${node.y - 35})`} 
                  className="cursor-pointer select-none group"
                  onClick={() => setSelectedNode(node.id)}
                >
                  <rect
                    width="130"
                    height="70"
                    rx="10"
                    className={`transition-all duration-300 ${
                      isSelected 
                        ? 'fill-slate-900 stroke-indigo-500 stroke-2 shadow-[0_0_12px_rgba(99,102,241,0.2)]' 
                        : 'fill-slate-950 stroke-slate-800 hover:stroke-slate-700'
                    }`}
                  />
                  
                  {/* Icon Container */}
                  <g transform="translate(12, 16)">
                    <circle cx="16" cy="16" r="16" className="fill-slate-900" />
                    <foreignObject x="6" y="6" width="20" height="20">
                      <IconComponent className={`h-5 w-5 ${node.color.split(' ')[0]}`} />
                    </foreignObject>
                  </g>

                  {/* Label */}
                  <text x="50" y="32" className="text-[11px] font-sans font-medium fill-slate-200" textAnchor="start">
                    {node.label.split(' ')[0]}
                  </text>
                  <text x="50" y="46" className="text-[9px] font-sans fill-slate-500" textAnchor="start">
                    {node.label.split(' ').slice(1).join(' ') || 'Service'}
                  </text>

                  {/* Operational Pulse */}
                  <circle cx="118" cy="12" r="3" className={`${isSelected ? 'fill-teal-400' : 'fill-slate-800'}`} />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info Panel */}
        <div className="xl:col-span-1 bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {activeNode.category}
              </span>
              <h3 className="text-xl font-bold text-white font-display mt-2">{activeNode.name}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{activeNode.description}</p>
            </div>

            <div className="border-t border-slate-800/80 pt-4 space-y-1.5">
              <span className="text-xs font-mono text-indigo-400">System Role</span>
              <p className="text-sm text-slate-300 leading-relaxed">{activeNode.role}</p>
            </div>

            <div className="border-t border-slate-800/80 pt-4 space-y-1.5">
              <span className="text-xs font-mono text-teal-400">Horizontal Scalability Strategy</span>
              <p className="text-sm text-slate-300 leading-relaxed">{activeNode.scalingStrategy}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-500 font-mono flex items-center justify-between">
            <span>Node Status: ACTIVE</span>
            <span className="flex h-2 w-2 rounded-full bg-teal-400" />
          </div>
        </div>
      </div>

      {/* Code Snippets config mapping */}
      {activeNode.configSnippet && (
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center bg-slate-900/60 border-b border-slate-800/80 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-mono text-slate-400">Target Configuration Blueprint</span>
            </div>
            <button
              onClick={() => handleCopy(activeNode.configSnippet || '')}
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded bg-indigo-950/40 border border-indigo-900/50 hover:bg-indigo-950/60 cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : null}
              {copied ? 'Copied' : 'Copy Snippet'}
            </button>
          </div>
          <pre className="p-5 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[250px] custom-scrollbar bg-slate-950">
            <code>{activeNode.configSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
