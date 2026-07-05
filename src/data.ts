import { TechStackItem, UserRole, DBTable, FolderNode, RoadmapPhase, APIGroup } from './types';

export const TECH_STACK: TechStackItem[] = [
  {
    name: 'Next.js 15 (App Router)',
    category: 'Frontend',
    description: 'Enterprise React framework featuring server-side rendering (SSR), optimized build caching, static site generation, and optimized image/font loaders.',
    iconName: 'Layout',
    role: 'Primary host for client dashboards, agent recharge portals, landing pages, and landing state generation.',
    scalingStrategy: 'Deployed to Vercel/CDN Edge, providing sub-10ms TTFB globally. Utilizes incremental static regeneration (ISR) for marketing/knowledge base articles.',
    configSnippet: `// next.config.ts\nimport type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {\n  reactStrictMode: true,\n  experimental: {\n    optimizePackageImports: ["@mui/material", "lucide-react"],\n  },\n  images: {\n    domains: ["pub-cloudflare-r2.com"],\n  },\n};\n\nexport default nextConfig;`
  },
  {
    name: 'NestJS v10',
    category: 'Backend',
    description: 'A progressive Node.js framework for building efficient, reliable, and scalable server-side applications, utilizing TypeScript and SOLID principles natively.',
    iconName: 'Cpu',
    role: 'Enterprise API Core handling payment routing, operator gateway integrations, commission calculations, and user management.',
    scalingStrategy: 'Containerized in Docker, deployed behind a Load Balancer (Nginx/HAProxy) on auto-scaling Ubuntu nodes. Serviced under Node Cluster or Kubernetes Horizontal Pod Autoscaler (HPA).',
    configSnippet: `// main.ts - NestJS Cluster Setup\nimport { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module';\nimport { ValidationPipe } from '@nestjs/common';\nimport helmet from 'helmet';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));\n  app.use(helmet());\n  app.enableCors({ origin: process.env.ALLOWED_ORIGINS.split(',') });\n  await app.listen(3000, '0.0.0.0');\n}\nbootstrap();`
  },
  {
    name: 'PostgreSQL (Neon / Serverless PostgreSQL)',
    category: 'Database',
    description: 'Serverless PostgreSQL with branchable storage, auto-scaling capabilities, and connection pooling.',
    iconName: 'Database',
    role: 'Primary transactional system of record storing user ledgers, operator packages, audit logs, and system states.',
    scalingStrategy: 'Neon scales compute dynamically up to 8 vCPUs. Employs PgBouncer for high-frequency connection pooling and database read-replicas for heavy reporting schedules.',
    configSnippet: `// prisma/schema.prisma\ndatasource db {\n  provider  = "postgresql"\n  url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")\n}`
  },
  {
    name: 'Prisma ORM',
    category: 'ORM',
    description: 'Type-safe Database client and schema migration tool mapping database structures directly to TypeScript types.',
    iconName: 'Code',
    role: 'Database abstract layer providing declarative schema models, relational mappings, and type safety during queries.',
    scalingStrategy: 'Utilizes Prisma Client query-engine binary with optimized nested queries and custom indexing mappings.',
    configSnippet: `// Sample Query\nconst agentWallet = await prisma.wallet.findUnique({\n  where: { userId: agentId },\n  include: { \n    user: true,\n    balances: true\n  }\n});`
  },
  {
    name: 'Redis',
    category: 'Caching',
    description: 'In-memory key-value data store used for sub-millisecond query responses and shared session locks.',
    iconName: 'Zap',
    role: 'Caches live operator packages, session authentication tokens, API rate limiter thresholds, and live recharge status mappings.',
    scalingStrategy: 'Redis Sentinel Cluster setup to prevent Single Points of Failure (SPOF) with master-slave replicas.',
    configSnippet: `// redis.config.ts\nimport Redis from 'ioredis';\n\nexport const redis = new Redis({\n  host: process.env.REDIS_HOST,\n  port: parseInt(process.env.REDIS_PORT || '6379'),\n  password: process.env.REDIS_PASSWORD,\n  maxRetriesPerRequest: null,\n});`
  },
  {
    name: 'BullMQ',
    category: 'Queue',
    description: 'Robust, Redis-backed queue system for message-based distributed job processing.',
    iconName: 'Layers',
    role: 'Handles asynchronous worker operations: sending multi-channel receipt notifications, retry hooks for operator APIs, commission distributions, and nightly financial settlement processing.',
    scalingStrategy: 'Horizontal worker scaling where multiple server nodes read from BullMQ, ensuring isolated non-blocking main thread execution.',
    configSnippet: `// recharge.processor.ts\nimport { Processor, WorkerHost } from '@nestjs/bullmq';\nimport { Job } from 'bull';\n\n@Processor('recharge-queue')\nexport class RechargeProcessor extends WorkerHost {\n  async process(job: Job<any>): Promise<any> {\n    // Execute operator API call, with automated retries\n    return await this.rechargeService.sendToOperator(job.data);\n  }\n}`
  }
];

export const USER_ROLES: UserRole[] = [
  {
    name: 'Super Admin',
    description: 'Absolute platform owner with unmitigated administrative access.',
    permissions: ['ALL_PERMISSIONS', 'MANAGE_API_KEYS', 'MANAGE_OPERATORS', 'MANAGE_COMMISSIONS', 'MANAGE_SYSTEM_SETTINGS', 'SYSTEM_BACKUP_RESTORE'],
    scope: 'System-wide structural configurations, system security, financial balances, global configurations, and platform maintenance.'
  },
  {
    name: 'Admin',
    description: 'Corporate manager dealing with core regional operators, standard packages, and dealer chains.',
    permissions: ['VIEW_AUDIT_LOGS', 'MANAGE_USERS', 'MANAGE_OFFERS', 'MANAGE_PACKAGES', 'APPROVE_KYC', 'RESOLVE_TICKETS'],
    scope: 'Daily platform monitoring, system support operations, user approvals, package controls, and transaction investigations.'
  },
  {
    name: 'Manager',
    description: 'Operations manager handling local customer support, dispute resolution, and reports generation.',
    permissions: ['VIEW_TRANSACTIONS', 'VIEW_RECHARGES', 'MANAGE_PACKAGES', 'VIEW_REPORTS', 'RESPOND_TICKETS'],
    scope: 'Operational workflow control, live dealer analytics tracking, and support ticket resolutions.'
  },
  {
    name: 'Distributor',
    description: 'B2B Wholesale Agent coordinating regional Dealer networks and bulk wallet top-ups.',
    permissions: ['CREATE_DEALER', 'TRANSFER_WALLET_DEALER', 'VIEW_DEALER_TRANSACTIONS', 'VIEW_OWN_COMMISSIONS'],
    scope: 'Regional network expansion, bulk dealer balance transfers, and wholesale profit optimization.'
  },
  {
    name: 'Master Dealer',
    description: 'High-volume regional merchant coordinating sub-dealers and high-tier Retailers.',
    permissions: ['CREATE_RETAILER', 'TRANSFER_WALLET_RETAILER', 'VIEW_RETAILER_RECHARGES', 'VIEW_OWN_COMMISSIONS'],
    scope: 'Distribution of bulk balances downwards, sub-dealer management, and micro-ledgering.'
  },
  {
    name: 'Dealer',
    description: 'Merchant supplying wallet balances to local Retailers and executing bulk transactional operations.',
    permissions: ['CREATE_RETAILER', 'TRANSFER_WALLET_RETAILER', 'VIEW_OWN_RETAILER_SALES'],
    scope: 'Local retail onboarding, physical retail collections, and local balance transfers.'
  },
  {
    name: 'Retailer',
    description: 'Local store owner executing manual customer prepaid and postpaid recharges.',
    permissions: ['EXECUTE_RECHARGE', 'COLLECT_POSTPAID_BILL', 'VIEW_OWN_SALES', 'REQUEST_DISTRIBUTOR_BALANCE'],
    scope: 'Point of sale, physical cash handling, rapid prepaid top-ups, and postpaid bill collections.'
  },
  {
    name: 'Agent',
    description: 'Mobile on-field promoter performing KYC verifications, customer onboarding, and micro-wallet transfers.',
    permissions: ['ONBOARD_CUSTOMER', 'EXECUTE_RECHARGE', 'KYC_ASSIST'],
    scope: 'Field operations, agent portal access, local customer onboarding campaigns, and immediate top-ups.'
  },
  {
    name: 'Customer',
    description: 'The end consumer utilizing the responsive website, PWA, or native application.',
    permissions: ['EXECUTE_OWN_RECHARGE', 'PAY_OWN_BILLS', 'VIEW_OWN_HISTORY', 'LOAD_OWN_WALLET_STRIPE', 'TRANSFER_FRIEND'],
    scope: 'Personal device usage, consumer profile, utility bill payments, and standard consumer wallet loads.'
  },
  {
    name: 'Support Team',
    description: 'Customer service executive resolving active tickets and handling live support chat.',
    permissions: ['VIEW_USER_PROFILES', 'RESOLVE_TICKETS', 'INITIATE_RECHARGE_INVESTIGATION'],
    scope: 'Customer service, chat handling, escalation route management, and ticket logging.'
  },
  {
    name: 'Finance Team',
    description: 'Corporate accounting division validating transaction audit trails and operator reconciliations.',
    permissions: ['VIEW_REVENUE_METRICS', 'MANAGE_TAX_CONFIG', 'PROCESS_REFUNDS', 'EXPORT_LEDGERS'],
    scope: 'Tax configurations, bulk payout approvals, refund processing, reconciliation checks, and balance sheets.'
  }
];

export const DB_SCHEMA: DBTable[] = [
  {
    name: 'users',
    description: 'Primary user table holding identities, core credentials, authentication statuses, and security keys.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique identifier for the user.' },
      { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE, NOT NULL', description: 'User email address used for logins/notifications.' },
      { name: 'phone', type: 'VARCHAR(20)', constraints: 'UNIQUE, NOT NULL', description: 'User phone number used for OTP/SMS alerts.' },
      { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Bcrypt hash of the user password.' },
      { name: 'role', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'User role matching Super Admin, Retailer, Customer, etc.' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Flag indicating if the user account is enabled.' },
      { name: 'two_factor_secret', type: 'VARCHAR(100)', constraints: 'NULL', description: 'Encrypted secret key for TOTP/Google Authenticator.' },
      { name: 'is_two_factor_enabled', type: 'BOOLEAN', constraints: 'DEFAULT FALSE', description: 'Flag for active 2FA enforcement.' },
      { name: 'kyc_status', type: 'VARCHAR(50)', constraints: 'DEFAULT \'PENDING\'', description: 'KYC Verification: PENDING, APPROVED, REJECTED.' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Timestamp of record insertion.' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Timestamp of last record edit.' },
      { name: 'deleted_at', type: 'TIMESTAMPTZ', constraints: 'NULL', description: 'Soft delete timestamp.' }
    ],
    indexes: [
      { name: 'idx_users_role', columns: 'role', type: 'B-Tree', purpose: 'Optimizes filtering user accounts by operational tiers.' },
      { name: 'idx_users_kyc_status', columns: 'kyc_status', type: 'B-Tree', purpose: 'Speeds up verification dashboards for admin panels.' },
      { name: 'idx_users_deleted_at', columns: 'deleted_at', type: 'B-Tree', purpose: 'Ensures queries filter out soft-deleted records instantly.' }
    ],
    relationships: []
  },
  {
    name: 'wallets',
    description: 'Wallet accounts associated with users, supporting multi-wallets (Main, Recharge Profit, Cashback).',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique identifier for the wallet.' },
      { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE', description: 'The owner of this wallet.' },
      { name: 'main_balance', type: 'DECIMAL(15,4)', constraints: 'NOT NULL, DEFAULT 0.0000', description: 'Cash balance available for recharge operations.' },
      { name: 'commission_balance', type: 'DECIMAL(15,4)', constraints: 'NOT NULL, DEFAULT 0.0000', description: 'Earned recharge commission balance.' },
      { name: 'cashback_balance', type: 'DECIMAL(15,4)', constraints: 'NOT NULL, DEFAULT 0.0000', description: 'Promotional cashback balance.' },
      { name: 'currency', type: 'VARCHAR(3)', constraints: 'DEFAULT \'USD\'', description: 'ISO 4217 Currency configuration.' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Timestamp of last wallet balance updates.' }
    ],
    indexes: [
      { name: 'idx_wallets_user_id', columns: 'user_id', type: 'Hash', purpose: 'Ensures sub-millisecond lookup of an individual user\'s wallet.' }
    ],
    relationships: [
      { fromColumn: 'user_id', toTable: 'users', toColumn: 'id', type: 'one-to-one' }
    ]
  },
  {
    name: 'operators',
    description: 'Telecom service operators mapped to recharge gateway integration keys.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique operator identifier.' },
      { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL, UNIQUE', description: 'Operator name (e.g., T-Mobile, Vodafone, AT&T).' },
      { name: 'code', type: 'VARCHAR(20)', constraints: 'NOT NULL, UNIQUE', description: 'Internal programmatic billing code.' },
      { name: 'country_code', type: 'VARCHAR(5)', constraints: 'NOT NULL', description: 'ISO Country code (e.g. US, UK, BD).' },
      { name: 'logo_url', type: 'VARCHAR(512)', constraints: 'NULL', description: 'Cloudflare R2 URL hosting the operator visual icon.' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Determines if this operator is acceptive of recharges.' }
    ],
    indexes: [
      { name: 'idx_operators_code', columns: 'code', type: 'Hash', purpose: 'Enables instant matching during auto-operator detection pipelines.' }
    ],
    relationships: []
  },
  {
    name: 'packages',
    description: 'Bundled packages, SMS packs, internet packages, and talk-time minutes products.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique package identifier.' },
      { name: 'operator_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES operators(id) ON DELETE CASCADE', description: 'The operator that offers this package.' },
      { name: 'name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Package product name (e.g. Unlimited Data 30 Days).' },
      { name: 'type', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Package categorizer: DATA, VOICE, SMS, COMBO, OFFER.' },
      { name: 'price', type: 'DECIMAL(10,2)', constraints: 'NOT NULL', description: 'Retail price of the package.' },
      { name: 'validity_days', type: 'INT', constraints: 'NOT NULL', description: 'Active period for the service bundle.' },
      { name: 'description', type: 'TEXT', constraints: 'NULL', description: 'Full description detailing bytes, SMS count, and talk limits.' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Is the bundle open for purchase.' }
    ],
    indexes: [
      { name: 'idx_packages_operator_type', columns: 'operator_id, type', type: 'B-Tree', purpose: 'Speeds up package rendering queries when filtered by operator and type.' }
    ],
    relationships: [
      { fromColumn: 'operator_id', toTable: 'operators', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'recharges',
    description: 'Transactional records containing all recharge requests, operator responses, and status codes.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique recharge transaction ID.' },
      { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id)', description: 'The merchant/retailer executing the recharge.' },
      { name: 'operator_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES operators(id)', description: 'The targeted telecom provider.' },
      { name: 'package_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES packages(id) NULL', description: 'Optional ID mapping to specific service packages.' },
      { name: 'recipient_number', type: 'VARCHAR(30)', constraints: 'NOT NULL', description: 'The target destination mobile number.' },
      { name: 'amount', type: 'DECIMAL(12,4)', constraints: 'NOT NULL', description: 'The core financial amount of the recharge.' },
      { name: 'status', type: 'VARCHAR(50)', constraints: 'DEFAULT \'INITIATED\'', description: 'INITIATED, QUEUED, SUCCESS, FAILED, REFUNDED.' },
      { name: 'gateway_reference', type: 'VARCHAR(255)', constraints: 'NULL', description: 'Operator network integration tracking ID.' },
      { name: 'gateway_response', type: 'JSONB', constraints: 'NULL', description: 'Direct API JSON response logged for structural auditable trail.' },
      { name: 'attempts', type: 'INT', constraints: 'DEFAULT 1', description: 'Network communication attempts executed.' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Timestamp of transaction initiation.' },
      { name: 'completed_at', type: 'TIMESTAMPTZ', constraints: 'NULL', description: 'Timestamp of successful operator handshake.' }
    ],
    indexes: [
      { name: 'idx_recharges_user_id', columns: 'user_id', type: 'B-Tree', purpose: 'Allows agents and merchants to retrieve sales history rapidly.' },
      { name: 'idx_recharges_status_created', columns: 'status, created_at', type: 'B-Tree', purpose: 'Essential index optimized for polling pending recharges and worker sweeps.' },
      { name: 'idx_recharges_recipient', columns: 'recipient_number', type: 'B-Tree', purpose: 'Speeds up support teams looking up client recharges by phone number.' }
    ],
    relationships: [
      { fromColumn: 'user_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' },
      { fromColumn: 'operator_id', toTable: 'operators', toColumn: 'id', type: 'many-to-one' },
      { fromColumn: 'package_id', toTable: 'packages', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'transactions',
    description: 'Double-entry general ledger recording every financial move (debit, credit, transfer) on the platform.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique ledger reference ID.' },
      { name: 'wallet_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES wallets(id)', description: 'Target wallet of the financial ledger transaction.' },
      { name: 'type', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Ledger type: CREDIT, DEBIT.' },
      { name: 'purpose', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Purpose mapping: RECHARGE, RECHARGE_COMMISSION, CASHBACK, WALLET_TRANSFER, TOPUP.' },
      { name: 'amount', type: 'DECIMAL(15,4)', constraints: 'NOT NULL', description: 'Absolute magnitude of currency moved.' },
      { name: 'previous_balance', type: 'DECIMAL(15,4)', constraints: 'NOT NULL', description: 'Balance of the wallet before the transaction execution.' },
      { name: 'current_balance', type: 'DECIMAL(15,4)', constraints: 'NOT NULL', description: 'Balance of the wallet immediately after ledger insertion.' },
      { name: 'reference_id', type: 'UUID', constraints: 'NULL', description: 'ID referencing the entity that triggered this (e.g. recharge_id, transfer_id).' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Timestamp of financial ledger write.' }
    ],
    indexes: [
      { name: 'idx_transactions_wallet', columns: 'wallet_id', type: 'B-Tree', purpose: 'Main entry index to retrieve audit timeline statements for wallets.' },
      { name: 'idx_transactions_ref_id', columns: 'reference_id', type: 'Hash', purpose: 'Connects ledger records directly to triggering processes for refunds/audits.' }
    ],
    relationships: [
      { fromColumn: 'wallet_id', toTable: 'wallets', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'audit_logs',
    description: 'Compliance tracking record for system integrity auditing.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique audit entry ID.' },
      { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE SET NULL', description: 'Action performer.' },
      { name: 'action', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Operation: UPDATE_COMMISSION_RULE, RECHARGE_REFUND, API_KEY_CYCLE, etc.' },
      { name: 'ip_address', type: 'VARCHAR(45)', constraints: 'NOT NULL', description: 'IP of the requester (supports IPv4 & IPv6).' },
      { name: 'user_agent', type: 'VARCHAR(255)', constraints: 'NULL', description: 'User agent of the requester.' },
      { name: 'old_values', type: 'JSONB', constraints: 'NULL', description: 'State of record prior to action.' },
      { name: 'new_values', type: 'JSONB', constraints: 'NULL', description: 'State of record post-action.' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Timestamp of audit write.' }
    ],
    indexes: [
      { name: 'idx_audit_logs_user_action', columns: 'user_id, action', type: 'B-Tree', purpose: 'Speeds up filtering audit compliance metrics by actor and context.' }
    ],
    relationships: [
      { fromColumn: 'user_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'commission_rules',
    description: 'Dynamic rules defining commissions and profit splits for operators and packages across user tiers.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique commission rule ID.' },
      { name: 'role', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Target user role tier.' },
      { name: 'operator_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES operators(id) NULL', description: 'Associated operator reference.' },
      { name: 'package_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES packages(id) NULL', description: 'Associated package reference.' },
      { name: 'percentage', type: 'DECIMAL(5,2)', constraints: 'NOT NULL', description: 'Commission percentage (e.g., 2.50%).' },
      { name: 'flat_rate', type: 'DECIMAL(10,4)', constraints: 'DEFAULT 0.0000', description: 'Flat commission rate if applicable.' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Enforcement state of the commission rule.' }
    ],
    indexes: [
      { name: 'uq_commission_rule', columns: 'role, operator_id, package_id', type: 'Unique', purpose: 'Ensures a unique rule matches a user role and operator catalog pair.' }
    ],
    relationships: [
      { fromColumn: 'operator_id', toTable: 'operators', toColumn: 'id', type: 'many-to-one' },
      { fromColumn: 'package_id', toTable: 'packages', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'commission_distributions',
    description: 'Recorded logs of individual commission splits paid out for executed recharges.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique distribution entry ID.' },
      { name: 'recharge_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES recharges(id) ON DELETE CASCADE', description: 'Triggering recharge transaction.' },
      { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE', description: 'Beneficiary merchant user.' },
      { name: 'amount', type: 'DECIMAL(12,4)', constraints: 'NOT NULL', description: 'Slices of money paid out.' },
      { name: 'percentage', type: 'DECIMAL(5,2)', constraints: 'NOT NULL', description: 'Applied commission slice percent.' }
    ],
    indexes: [
      { name: 'idx_comm_dist_recharge', columns: 'recharge_id', type: 'B-Tree', purpose: 'Optimizes lookup of commission distributions for any given recharge.' },
      { name: 'idx_comm_dist_user', columns: 'user_id', type: 'B-Tree', purpose: 'Speeds up checking profit statements for B2B merchants.' }
    ],
    relationships: [
      { fromColumn: 'recharge_id', toTable: 'recharges', toColumn: 'id', type: 'many-to-one' },
      { fromColumn: 'user_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'kyc_verifications',
    description: 'B2B onboarding records and compliance checking verification.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique verification process ID.' },
      { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE', description: 'User submitting documents.' },
      { name: 'document_type', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Type of identity document (Passport, NID, License).' },
      { name: 'document_ref', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Document serial number.' },
      { name: 'front_img_url', type: 'VARCHAR(512)', constraints: 'NOT NULL', description: 'URL of the identity front face.' },
      { name: 'back_img_url', type: 'VARCHAR(512)', constraints: 'NULL', description: 'URL of the identity back face.' },
      { name: 'status', type: 'VARCHAR(50)', constraints: 'DEFAULT \'PENDING\'', description: 'PENDING, APPROVED, REJECTED, RE_SUBMISSION_REQUIRED.' }
    ],
    indexes: [
      { name: 'idx_kyc_user_id', columns: 'user_id', type: 'B-Tree', purpose: 'Fast lookup of KYC submissions by user.' },
      { name: 'idx_kyc_status', columns: 'status', type: 'B-Tree', purpose: 'Speeds up verification queues for backoffice operators.' }
    ],
    relationships: [
      { fromColumn: 'user_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'api_keys',
    description: 'API client access keys for merchants and bulk distributors.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique API key entry ID.' },
      { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE', description: 'Authorized user owner.' },
      { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Friendly descriptor label.' },
      { name: 'key_prefix', type: 'VARCHAR(8)', constraints: 'UNIQUE, NOT NULL', description: 'Visible prefix of the API key.' },
      { name: 'key_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Bcrypt hash of the full secure key.' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Enable/disable switch for the key.' }
    ],
    indexes: [
      { name: 'idx_api_keys_user', columns: 'user_id', type: 'B-Tree', purpose: 'Fast lookup of API keys owned by a user.' }
    ],
    relationships: [
      { fromColumn: 'user_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'webhook_subscriptions',
    description: 'Custom subscription endpoints for instant programmatic status updates.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique subscription ID.' },
      { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE', description: 'Subscribed client.' },
      { name: 'callback_url', type: 'VARCHAR(512)', constraints: 'NOT NULL', description: 'HTTP endpoint where callback requests are posted.' },
      { name: 'secret_signing_key', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'HMAC signature verification key.' },
      { name: 'subscribed_events', type: 'TEXT[]', constraints: 'NOT NULL', description: 'Events to dispatch (e.g. RECHARGE.SUCCESS, WALLET.CREDIT).' }
    ],
    indexes: [
      { name: 'idx_webhook_subs_user', columns: 'user_id', type: 'B-Tree', purpose: 'Speeds up webhook dispatching pipelines.' }
    ],
    relationships: [
      { fromColumn: 'user_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'support_tickets',
    description: 'Support and complaint tracking system records.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique ticket ID.' },
      { name: 'customer_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE', description: 'Requester user.' },
      { name: 'assigned_to', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) NULL ON DELETE SET NULL', description: 'Handling support agent.' },
      { name: 'subject', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Brief ticket subject summary.' },
      { name: 'status', type: 'VARCHAR(50)', constraints: 'DEFAULT \'OPEN\'', description: 'OPEN, IN_PROGRESS, RESOLVED, CLOSED.' }
    ],
    indexes: [
      { name: 'idx_tickets_customer', columns: 'customer_id', type: 'B-Tree', purpose: 'Fast lookup of tickets opened by a user.' },
      { name: 'idx_tickets_status', columns: 'status', type: 'B-Tree', purpose: 'Speeds up helpdesk queues.' }
    ],
    relationships: [
      { fromColumn: 'customer_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' },
      { fromColumn: 'assigned_to', toTable: 'users', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'live_chat_messages',
    description: 'Thread records for support ticket dialogs.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique message ID.' },
      { name: 'ticket_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES support_tickets(id) ON DELETE CASCADE', description: 'Associated support ticket.' },
      { name: 'sender_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE', description: 'Message sender (customer or agent).' },
      { name: 'message', type: 'TEXT', constraints: 'NOT NULL', description: 'Message markdown content.' }
    ],
    indexes: [
      { name: 'idx_chat_messages_ticket', columns: 'ticket_id', type: 'B-Tree', purpose: 'Fast chronological message loading.' }
    ],
    relationships: [
      { fromColumn: 'ticket_id', toTable: 'support_tickets', toColumn: 'id', type: 'many-to-one' },
      { fromColumn: 'sender_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' }
    ]
  },
  {
    name: 'notifications',
    description: 'Multi-channel outbound alerts and message delivery tracking.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Unique message entry ID.' },
      { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE', description: 'Target recipient.' },
      { name: 'channel', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Delivery mechanism: SMS, EMAIL, WHATSAPP, PUSH.' },
      { name: 'title', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Notification title.' },
      { name: 'content', type: 'TEXT', constraints: 'NOT NULL', description: 'Alert details.' },
      { name: 'is_sent', type: 'BOOLEAN', constraints: 'DEFAULT FALSE', description: 'True once successfully handed over to provider.' }
    ],
    indexes: [
      { name: 'idx_notifications_user', columns: 'user_id', type: 'B-Tree', purpose: 'Fast loading of customer alerts centers.' }
    ],
    relationships: [
      { fromColumn: 'user_id', toTable: 'users', toColumn: 'id', type: 'many-to-one' }
    ]
  }
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'Platform Foundation & Security',
    duration: 'Weeks 1-2',
    subtitle: 'Core database structures, Multi-Tenant Auth system, and baseline API Gateway.',
    status: 'planned',
    tasks: [
      {
        id: 'P1-T1',
        title: 'Neon PostgreSQL Provisioning & Schema Deploy',
        status: 'planned',
        description: 'Initialize serverless PostgreSQL schema migrations using Prisma. Create structural triggers and database constraints.',
        technicalDetails: [
          'Create tables, foreign keys, and optimized indexes.',
          'Inject triggers for audit tables (shadow auditing on critical tables like users and wallets).',
          'Deploy seed data mapping active global operators and default commission structures.'
        ]
      },
      {
        id: 'P1-T2',
        title: 'NestJS Multi-Tenant Auth Engine',
        status: 'planned',
        description: 'Configure clean robust JWT authentication, refresh tokens, role-based access controls (RBAC), and 2FA modules.',
        technicalDetails: [
          'Generate asymmetric RS256 JWT keypairs.',
          'Implement Google Authenticator TOTP module using node-2fa.',
          'Develop Role-Guard decorator to map route permissions directly to UserRole definitions.'
        ]
      }
    ]
  },
  {
    phase: 2,
    title: 'Wallet Ledgers & Balance Engines',
    duration: 'Weeks 3-4',
    subtitle: 'Implementation of the transaction ledger system, double-entry protections, and money routing engines.',
    status: 'planned',
    tasks: [
      {
        id: 'P2-T1',
        title: 'Double-Entry Transaction Engine',
        status: 'planned',
        description: 'Develop the Core ledger service, wrapping credit and debit events in database transaction blocks.',
        technicalDetails: [
          'Ensure isolated transaction locks (SELECT FOR UPDATE) on targets during money manipulation to avoid race-condition overdrafts.',
          'Implement automated balancing asserts during each ledger update.'
        ]
      },
      {
        id: 'P2-T2',
        title: 'Wallet-to-Wallet Money Routing',
        status: 'planned',
        description: 'Establish distribution mechanisms enabling hierarchical wallet transfers (Distributor -> Dealer -> Retailer).',
        technicalDetails: [
          'Validate distributor margins and debit constraints.',
          'Configure real-time SMS/Email transfer notifications via background message queues (BullMQ).'
        ]
      }
    ]
  },
  {
    phase: 3,
    title: 'Telecom Gateway Integration & Commission Engine',
    duration: 'Weeks 5-6',
    subtitle: 'Connection to third-party airtime APIs, automated operator check routines, and profit/commission engines.',
    status: 'planned',
    tasks: [
      {
        id: 'P3-T1',
        title: 'Recharge Gateway Integration (Stripe, Twilio, MobileAirtime API)',
        status: 'planned',
        description: 'Implement integration modules linking our core recharge routing to international direct airtime API portals.',
        technicalDetails: [
          'Code highly resilient API connector wrappers featuring exponential backoff retries.',
          'Build Webhook callback handlers in NestJS to process operator network handshakes.',
          'Configure Redis key caching for operator query endpoints.'
        ]
      },
      {
        id: 'P3-T2',
        title: 'Dynamic Commission & Hierarchy Profit Calculation',
        status: 'planned',
        description: 'Create computational pipelines to disperse instant cashback or wholesale hierarchical commission margins.',
        technicalDetails: [
          'Build commission engine resolving rule priorities based on Operator, Package, and Merchant Role.',
          'Implement recursive margin dispersal (e.g., Retailer gets 2%, Dealer gets 0.5%, Distributor gets 0.2%).'
        ]
      }
    ]
  },
  {
    phase: 4,
    title: 'Omnichannel Notification & KYC Core',
    duration: 'Week 7',
    subtitle: 'User verification procedures, live SMS, WhatsApp alerts, and automated account locks.',
    status: 'planned',
    tasks: [
      {
        id: 'P4-T1',
        title: 'Omnichannel Background Messaging Queue (BullMQ + Redis)',
        status: 'planned',
        description: 'Configure automated notification disperser dispatching alerts over SMS, Webhooks, and WhatsApp.',
        technicalDetails: [
          'Deploy BullMQ processor clusters managing high-volume parallel requests.',
          'Integrate Twilio API (SMS) and Meta Cloud API (WhatsApp Business Gateway).'
        ]
      },
      {
        id: 'P4-T2',
        title: 'On-Field KYC Assistant & Admin Verifications',
        status: 'planned',
        description: 'Establish secure document uploading workflows mapped to agent assist procedures.',
        technicalDetails: [
          'Configure Cloudflare R2 presigned-url generators in NestJS to keep document storage secure.',
          'Write image compression pipelines converting raw identification papers to secure webp assets.'
        ]
      }
    ]
  },
  {
    phase: 5,
    title: 'Enterprise Client Dashboards',
    duration: 'Weeks 8-9',
    subtitle: 'Responsive dashboards, real-time live reporting cards, and visual charts for admins and merchants.',
    status: 'planned',
    tasks: [
      {
        id: 'P5-T1',
        title: 'Merchant & Agent Mobile Portal (Next.js PWA)',
        status: 'planned',
        description: 'Create an offline-ready, responsive client app featuring rapid top-up entries and ledger dashboards.',
        technicalDetails: [
          'Code high-speed operator auto-detect routines mapping mobile prefixes dynamically as the user types.',
          'Optimize grid listings with skeleton components, virtualized scroll elements, and clear empty states.'
        ]
      },
      {
        id: 'P5-T2',
        title: 'Corporate Admin Control Console',
        status: 'planned',
        description: 'Develop rich administration control dashboards featuring live operator monitoring cards, ledger charts, and fraud prevention toggles.',
        technicalDetails: [
          'Integrate interactive line charts (Recharts/D3) tracking sales velocity, revenue metrics, and operator success trends.',
          'Build real-time websocket monitoring channels listing incoming tickets and active gateway latency statistics.'
        ]
      }
    ]
  },
  {
    phase: 6,
    title: 'Scalability, Load-Balancing & Launch',
    duration: 'Week 10',
    subtitle: 'Containerization, Nginx load balancing configurations, automated CI/CD deployment runs, and load test sweeps.',
    status: 'planned',
    tasks: [
      {
        id: 'P6-T1',
        title: 'Dockerization & Nginx Load Balancing Configs',
        status: 'planned',
        description: 'Establish enterprise container environments containing Dockerfiles, multi-stage builds, and reverse proxies.',
        technicalDetails: [
          'Write multi-stage Alpine-based Node Docker images to reduce bundle size to <150MB.',
          'Configure Nginx reverse proxy routing traffic securely, stripping headers, and establishing server-level TLS 1.3.'
        ]
      },
      {
        id: 'P6-T2',
        title: 'Load Testing, Vulnerability Scanning & CI/CD Release',
        status: 'planned',
        description: 'Perform extreme system stressors to evaluate locking mechanics and trigger automated pipeline deployments.',
        technicalDetails: [
          'Run automated siege testing scripts analyzing ledger resilience during high concurrent balance debits.',
          'Deploy production codes via GitHub Actions pipelines targeting edge nodes (Vercel) and VM hosts (Ubuntu VPS).'
        ]
      }
    ]
  }
];

export const FILE_STRUCTURE: FolderNode = {
  name: 'enterprise-telecom-saas',
  type: 'directory',
  path: '.',
  description: 'Root container for the unified Enterprise Telecom Recharge & Billing repository.',
  children: [
    {
      name: 'backend-nestjs',
      type: 'directory',
      path: './backend-nestjs',
      description: 'The modular enterprise REST API core powered by NestJS, Prisma, and BullMQ.',
      children: [
        {
          name: 'prisma',
          type: 'directory',
          path: './backend-nestjs/prisma',
          description: 'Database models, connection config, and system database migration files.',
          children: [
            {
              name: 'schema.prisma',
              type: 'file',
              path: './backend-nestjs/prisma/schema.prisma',
              description: 'The core schema declaring PostgreSQL tables, fields, constraints, indexes, and relations.',
              blueprintContent: `datasource db {\n  provider  = "postgresql"\n  url       = env("DATABASE_URL")\n}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  MANAGER\n  DISTRIBUTOR\n  MASTER_DEALER\n  DEALER\n  RETAILER\n  AGENT\n  CUSTOMER\n  SUPPORT\n  FINANCE\n}\n\nenum RechargeStatus {\n  INITIATED\n  QUEUED\n  SUCCESS\n  FAILED\n  REFUNDED\n}\n\nmodel User {\n  id                  String     @id @default(uuid()) @db.Uuid\n  email               String     @unique\n  phone               String     @unique\n  passwordHash        String     @map("password_hash")\n  role                Role       @default(CUSTOMER)\n  isActive            Boolean    @default(true) @map("is_active")\n  kycStatus           String     @default("PENDING") @map("kyc_status")\n  twoFactorSecret     String?    @map("two_factor_secret")\n  isTwoFactorEnabled  Boolean    @default(false) @map("is_two_factor_enabled")\n  createdAt           DateTime   @default(now()) @map("created_at")\n  updatedAt           DateTime   @updatedAt @map("updated_at")\n  deletedAt           DateTime?  @map("deleted_at")\n  wallet              Wallet?\n  recharges           Recharge[]\n  auditLogs           AuditLog[]\n\n  @@map("users")\n  @@index([role])\n  @@index([deletedAt])\n}`
            },
            {
              name: 'migrations',
              type: 'directory',
              path: './backend-nestjs/prisma/migrations',
              description: 'Prisma migration logs and corresponding raw SQL statements.'
            }
          ]
        },
        {
          name: 'src',
          type: 'directory',
          path: './backend-nestjs/src',
          description: 'TypeScript core source files.',
          children: [
            {
              name: 'app.module.ts',
              type: 'file',
              path: './backend-nestjs/src/app.module.ts',
              description: 'The master app module importing feature modules and configuring global caches/queues.',
              blueprintContent: `import { Module } from '@nestjs/common';\nimport { ConfigModule } from '@nestjs/config';\nimport { BullModule } from '@nestjs/bullmq';\nimport { AuthModule } from './auth/auth.module';\nimport { UserModule } from './user/user.module';\nimport { WalletModule } from './wallet/wallet.module';\nimport { RechargeModule } from './recharge/recharge.module';\nimport { CommissionModule } from './commission/commission.module';\n\n@Module({\n  imports: [\n    ConfigModule.forRoot({ isGlobal: true }),\n    BullModule.forRoot({\n      connection: { host: process.env.REDIS_HOST, port: 6379 }\n    }),\n    AuthModule, UserModule, WalletModule, RechargeModule, CommissionModule\n  ],\n})\nexport class AppModule {}`
            },
            {
              name: 'auth',
              type: 'directory',
              path: './backend-nestjs/src/auth',
              description: 'Authentication logic including JWT strategies, password hashing, and 2FA.',
              children: [
                {
                  name: 'auth.controller.ts',
                  type: 'file',
                  path: './backend-nestjs/src/auth/auth.controller.ts',
                  description: 'Handles requests for logins, registration, MFA, and OAuth configurations.',
                  blueprintContent: `import { Controller, Post, Body, UseGuards } from '@nestjs/common';\nimport { AuthService } from './auth.service';\nimport { LoginDto, RegisterDto } from './dto';\n\n@Controller('auth')\nexport class AuthController {\n  constructor(private authService: AuthService) {}\n\n  @Post('login')\n  async login(@Body() dto: LoginDto) {\n    return this.authService.login(dto);\n  }\n\n  @Post('register')\n  async register(@Body() dto: RegisterDto) {\n    return this.authService.register(dto);\n  }\n}`
                },
                {
                  name: 'auth.service.ts',
                  type: 'file',
                  path: './backend-nestjs/src/auth/auth.service.ts',
                  description: 'Core logic validating JWT signatures and 2FA passcode matching.'
                }
              ]
            },
            {
              name: 'recharge',
              type: 'directory',
              path: './backend-nestjs/src/recharge',
              description: 'Handles the core telecom airtime integration flow.',
              children: [
                {
                  name: 'recharge.controller.ts',
                  type: 'file',
                  path: './backend-nestjs/src/recharge/recharge.controller.ts',
                  description: 'Exposes merchant airtime execution endpoints.',
                  blueprintContent: `import { Controller, Post, Body, UseGuards } from '@nestjs/common';\nimport { RechargeService } from './recharge.service';\nimport { CreateRechargeDto } from './dto';\nimport { JwtAuthGuard, RolesGuard } from '../auth/guards';\nimport { Roles } from '../auth/decorators';\n\n@Controller('recharges')\n@UseGuards(JwtAuthGuard, RolesGuard)\nexport class RechargeController {\n  constructor(private rechargeService: RechargeService) {}\n\n  @Post('execute')\n  @Roles('RETAILER', 'AGENT', 'CUSTOMER')\n  async executeRecharge(@Body() dto: CreateRechargeDto) {\n    return this.rechargeService.initiateRecharge(dto);\n  }\n}`
                },
                {
                  name: 'recharge.processor.ts',
                  type: 'file',
                  path: './backend-nestjs/src/recharge/recharge.processor.ts',
                  description: 'BullMQ queue worker sending asynchronous recharge requests to operator APIs.'
                },
                {
                  name: 'recharge.service.ts',
                  type: 'file',
                  path: './backend-nestjs/src/recharge/recharge.service.ts',
                  description: 'Recharge business rules, balance validations, and operator gateway selection.'
                }
              ]
            },
            {
              name: 'wallet',
              type: 'directory',
              path: './backend-nestjs/src/wallet',
              description: 'Balances, double-entry financial ledgering, and safety asserts.',
              children: [
                {
                  name: 'wallet.service.ts',
                  type: 'file',
                  path: './backend-nestjs/src/wallet/wallet.service.ts',
                  description: 'Core transactional balancing operations using isolated DB transactions.',
                  blueprintContent: `import { Injectable, BadRequestException } from '@nestjs/common';\nimport { PrismaService } from '../prisma/prisma.service';\n\n@Injectable()\nexport class WalletService {\n  constructor(private prisma: PrismaService) {}\n\n  async debitWallet(userId: string, amount: number, referenceId: string) {\n    return this.prisma.$transaction(async (tx) => {\n      const wallet = await tx.wallet.findUnique({ \n        where: { userId },\n        select: { id: true, mainBalance: true }\n      });\n      if (wallet.mainBalance < amount) {\n        throw new BadRequestException('Insufficient balance');\n      }\n      await tx.wallet.update({\n        where: { id: wallet.id },\n        data: { mainBalance: { decrement: amount } }\n      });\n      return tx.transaction.create({\n        data: {\n          walletId: wallet.id,\n          type: 'DEBIT',\n          purpose: 'RECHARGE',\n          amount,\n          previousBalance: wallet.mainBalance,\n          currentBalance: wallet.mainBalance - amount,\n          referenceId\n        }\n      });\n    });\n  }\n}`
                }
              ]
            }
          ]
        },
        {
          name: 'Dockerfile',
          type: 'file',
          path: './backend-nestjs/Dockerfile',
          description: 'Multi-stage production build configuration for NestJS containers.',
          blueprintContent: `FROM node:20-alpine AS builder\nWORKDIR /usr/src/app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npx prisma generate\nRUN npm run build\n\nFROM node:20-alpine\nWORKDIR /usr/src/app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY --from=builder /usr/src/app/dist ./dist\nCOPY --from=builder /usr/src/app/prisma ./prisma\nCOPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma\n\nEXPOSE 3000\nCMD ["node", "dist/main"]`
        }
      ]
    },
    {
      name: 'frontend-nextjs',
      type: 'directory',
      path: './frontend-nextjs',
      description: 'The highly modern desktop and mobile (PWA) client application.',
      children: [
        {
          name: 'src',
          type: 'directory',
          path: './frontend-nextjs/src',
          description: 'Client app source files including route handlers and page views.',
          children: [
            {
              name: 'app',
              type: 'directory',
              path: './frontend-nextjs/src/app',
              description: 'Next.js App Router routing directories.',
              children: [
                {
                  name: 'layout.tsx',
                  type: 'file',
                  path: './frontend-nextjs/src/app/layout.tsx',
                  description: 'Sets global HTML structures, SEO tags, and visual theme providers.',
                  blueprintContent: `import React, { ReactNode } from 'react';\nimport './globals.css';\n\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return (\n    <html lang="en" className="dark">\n      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">\n        {children}\n      </body>\n    </html>\n  );\n}`
                },
                {
                  name: 'globals.css',
                  type: 'file',
                  path: './frontend-nextjs/src/app/globals.css',
                  description: 'Global stylesheet importing Tailwind layers and defining custom scrollbars.',
                  blueprintContent: `@import "tailwindcss";\n\n@layer base {\n  body {\n    @apply bg-slate-950 text-slate-100 antialiased;\n  }\n}`
                },
                {
                  name: 'page.tsx',
                  type: 'file',
                  path: './frontend-nextjs/src/app/page.tsx',
                  description: 'The global landing page introducing the B2B platform with interactive metrics.',
                  blueprintContent: `export default function LandingPage() {\n  return (\n    <div className="p-12 text-center space-y-6">\n      <h1 className="text-4xl font-extrabold text-white">Telecom Airtime SaaS Portal</h1>\n      <p className="text-slate-400">Instantly disperse bulk cell recharges with real-time double-entry logs.</p>\n    </div>\n  );\n}`
                },
                {
                  name: 'login',
                  type: 'directory',
                  path: './frontend-nextjs/src/app/login',
                  description: 'Handles credentials authorization, multi-tenant roles, and secure 2FA prompts.',
                  children: [
                    {
                      name: 'page.tsx',
                      type: 'file',
                      path: './frontend-nextjs/src/app/login/page.tsx',
                      description: 'Role-based login controller featuring dynamic password and simulated 2FA checks.',
                      blueprintContent: `export default function LoginPage() {\n  return (\n    <div className="p-8 max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl">\n      <h2 className="text-xl font-bold text-white mb-4">Merchant Login</h2>\n      <form className="space-y-4">\n        <input type="text" placeholder="Phone Number" className="w-full bg-slate-950 p-2.5 rounded-xl text-xs" />\n      </form>\n    </div>\n  );\n}`
                    }
                  ]
                },
                {
                  name: 'dashboard',
                  type: 'directory',
                  path: './frontend-nextjs/src/app/dashboard',
                  description: 'Secured agent/merchant dashboards.',
                  children: [
                    {
                      name: 'layout.tsx',
                      type: 'file',
                      path: './frontend-nextjs/src/app/dashboard/layout.tsx',
                      description: 'Renders the sidebar navigation grid and responsive layout.',
                      blueprintContent: `export default function DashboardLayout({ children }: { children: ReactNode }) {\n  return (\n    <div className="flex bg-slate-950 min-h-screen">\n      <aside className="w-64 border-r border-slate-900 p-6">Sidebar</aside>\n      <main className="flex-1 p-8">{children}</main>\n    </div>\n  );\n}`
                    },
                    {
                      name: 'page.tsx',
                      type: 'file',
                      path: './frontend-nextjs/src/app/dashboard/page.tsx',
                      description: 'Primary dashboard view rendering stats summary cards and airtime panel.',
                      blueprintContent: `export default function Dashboard() {\n  return (\n    <div className="space-y-6">\n      <h1 className="text-2xl font-bold text-white">Merchant Console</h1>\n    </div>\n  );\n}`
                    },
                    {
                      name: 'recharges',
                      type: 'directory',
                      path: './frontend-nextjs/src/app/dashboard/recharges',
                      description: 'Secured logs portal for monitoring transactions.',
                      children: [
                        {
                          name: 'page.tsx',
                          type: 'file',
                          path: './frontend-nextjs/src/app/dashboard/recharges/page.tsx',
                          description: 'Table ledger rendering transactions with deep-dive handshake inspectors.',
                          blueprintContent: `export default function RechargesLogs() {\n  return <div className="p-6">Recharge Logs & Handshakes</div>;\n}`
                        }
                      ]
                    },
                    {
                      name: 'wallet',
                      type: 'directory',
                      path: './frontend-nextjs/src/app/dashboard/wallet',
                      description: 'Ledger and balance accounts.',
                      children: [
                        {
                          name: 'page.tsx',
                          type: 'file',
                          path: './frontend-nextjs/src/app/dashboard/wallet/page.tsx',
                          description: 'Balance dashboard for loading funds and peer-to-peer credit transfers.',
                          blueprintContent: `export default function WalletLedger() {\n  return <div className="p-6">Double-Entry Ledger Account</div>;\n}`
                        }
                      ]
                    },
                    {
                      name: 'support',
                      type: 'directory',
                      path: './frontend-nextjs/src/app/dashboard/support',
                      description: 'Direct support communication gateway.',
                      children: [
                        {
                          name: 'page.tsx',
                          type: 'file',
                          path: './frontend-nextjs/src/app/dashboard/support/page.tsx',
                          description: 'Live chat portal supporting customer support ticketing threads.',
                          blueprintContent: `export default function SupportChat() {\n  return <div className="p-6">Helpdesk Compliance Chat</div>;\n}`
                        }
                      ]
                    },
                    {
                      name: 'admin',
                      type: 'directory',
                      path: './frontend-nextjs/src/app/dashboard/admin',
                      description: 'System administration console.',
                      children: [
                        {
                          name: 'page.tsx',
                          type: 'file',
                          path: './frontend-nextjs/src/app/dashboard/admin/page.tsx',
                          description: 'Commission margin modifiers and pending merchant KYC document checklists.',
                          blueprintContent: `export default function AdminConsole() {\n  return <div className="p-6">Corporate Rules & Compliance</div>;\n}`
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'android-app',
      type: 'directory',
      path: './android-app',
      description: 'Native merchant and agent smartphone portal engineered in Kotlin and modern Jetpack Compose.',
      children: [
        {
          name: 'app',
          type: 'directory',
          path: './android-app/app',
          description: 'Main Android application module with core assets and Gradle rules.',
          children: [
            {
              name: 'build.gradle.kts',
              type: 'file',
              path: './android-app/app/build.gradle.kts',
              description: 'Specifies target Android SDK 34, Material 3 compiler, and Retrofit network libraries.',
              blueprintContent: `plugins {\n    id("com.android.application")\n    id("org.jetbrains.kotlin.android")\n}\n\ndependencies {\n    implementation("androidx.compose.material3:material3")\n    implementation("androidx.navigation:navigation-compose:2.7.6")\n    implementation("com.squareup.retrofit2:retrofit:2.9.0")\n}`
            },
            {
              name: 'src',
              type: 'directory',
              path: './android-app/app/src',
              description: 'Kotlin source codes, layout blueprints, and XML resource files.',
              children: [
                {
                  name: 'main',
                  type: 'directory',
                  path: './android-app/app/src/main',
                  description: 'Production-ready Android configurations.',
                  children: [
                    {
                      name: 'AndroidManifest.xml',
                      type: 'file',
                      path: './android-app/app/src/main/AndroidManifest.xml',
                      description: 'Declares activity classes and requests INTERNET permissions to route backend calls.',
                      blueprintContent: `<?xml version="1.0" encoding="utf-8"?>\n<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n    <uses-permission android:name="android.permission.INTERNET" />\n    <application android:theme="@android:style/Theme.DeviceDefault.NoActionBar" />\n</manifest>`
                    },
                    {
                      name: 'java',
                      type: 'directory',
                      path: './android-app/app/src/main/java',
                      description: 'The main package directory tree.',
                      children: [
                        {
                          name: 'com.rechargesaas.app',
                          type: 'directory',
                          path: './android-app/app/src/main/java/com/rechargesaas/app',
                          description: 'Core source code bundle.',
                          children: [
                            {
                              name: 'MainActivity.kt',
                              type: 'file',
                              path: './android-app/app/src/main/java/com/rechargesaas/app/MainActivity.kt',
                              description: 'Binds the theme context and sets up Compose NavHost for login and dashboard pathways.',
                              blueprintContent: `class MainActivity : ComponentActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContent {\n            RechargeSaaSTheme {\n                NavHost(navController, startDestination = "login") {\n                    composable("login") { LoginScreen() }\n                }\n            }\n        }\n    }\n}`
                            },
                            {
                              name: 'api',
                              type: 'directory',
                              path: './android-app/app/src/main/java/com/rechargesaas/app/api',
                              description: 'REST network interfaces using Retrofit and double-entry API models.',
                              children: [
                                {
                                  name: 'ApiService.kt',
                                  type: 'file',
                                  path: './android-app/app/src/main/java/com/rechargesaas/app/api/ApiService.kt',
                                  description: 'Declarative Retrofit contract corresponding with NestJS billing APIs.',
                                  blueprintContent: `interface ApiService {\n    @POST("api/v1/auth/login")\n    suspend fun login(@Body req: LoginRequest): LoginResponse\n\n    @POST("api/v1/recharges/execute")\n    suspend fun executeRecharge(@Header("Authorization") jwt: String, @Body req: RechargeRequest): RechargeResponse\n}`
                                }
                              ]
                            },
                            {
                              name: 'ui',
                              type: 'directory',
                              path: './android-app/app/src/main/java/com/rechargesaas/app/ui',
                              description: 'User interface components, Material Design themes, and custom screens.',
                              children: [
                                {
                                  name: 'screens',
                                  type: 'directory',
                                  path: './android-app/app/src/main/java/com/rechargesaas/app/ui/screens',
                                  description: 'Screen UI compositions styled with Material Design components.',
                                  children: [
                                    {
                                      name: 'LoginScreen.kt',
                                      type: 'file',
                                      path: './android-app/app/src/main/java/com/rechargesaas/app/ui/screens/LoginScreen.kt',
                                      description: 'Biometric authorization credentials prompts and 2FA SMS tokens verification fields.',
                                      blueprintContent: `@Composable\nfun LoginScreen(onLoginSuccess: (String, String) -> Unit) {\n    Column(modifier = Modifier.background(BackgroundDark)) {\n        OutlinedTextField(phone, onValueChange)\n        Button(onClick = { onLoginSuccess(token, "RETAILER") }) { Text("AUTHENTICATE") }\n    }\n}`
                                    },
                                    {
                                      name: 'DashboardScreen.kt',
                                      type: 'file',
                                      path: './android-app/app/src/main/java/com/rechargesaas/app/ui/screens/DashboardScreen.kt',
                                      description: 'Features double-entry ledger summaries, active commissions tracker, and recent transaction feeds.',
                                      blueprintContent: `@Composable\nfun DashboardScreen(role: String, onNavigateToRecharge: () -> Unit) {\n    Scaffold(containerColor = BackgroundDark) {\n        Card { Text("MAIN BALANCE: $12,450.00") }\n        Button(onClick = onNavigateToRecharge) { Text("RECHARGE AIRTIME") }\n    }\n}`
                                    },
                                    {
                                      name: 'RechargeScreen.kt',
                                      type: 'file',
                                      path: './android-app/app/src/main/java/com/rechargesaas/app/ui/screens/RechargeScreen.kt',
                                      description: 'Automated prefix-detection system mapping operator gateways dynamically.',
                                      blueprintContent: `@Composable\nfun RechargeScreen(onNavigateBack: () -> Unit) {\n    Column {\n        OutlinedTextField(phoneNumber, onValueChange)\n        Text("Auto-Routing Handshake: Grameenphone")\n    }\n}`
                                    },
                                    {
                                      name: 'WalletScreen.kt',
                                      type: 'file',
                                      path: './android-app/app/src/main/java/com/rechargesaas/app/ui/screens/WalletScreen.kt',
                                      description: 'P2P balance transfers console and double-entry ledger loads.',
                                      blueprintContent: `@Composable\nfun WalletScreen(onNavigateBack: () -> Unit) {\n    Column {\n        Text("Main Balance: $12,450.00")\n        Button(onClick = { /* Transfer */ }) { Text("AUTHORIZE P2P TRANSFER") }\n    }\n}`
                                    }
                                  ]
                                },
                                {
                                  name: 'theme',
                                  type: 'directory',
                                  path: './android-app/app/src/main/java/com/rechargesaas/app/ui/theme',
                                  description: 'Material Design typography, colors, and shape modifiers.',
                                  children: [
                                    {
                                      name: 'Theme.kt',
                                      type: 'file',
                                      path: './android-app/app/src/main/java/com/rechargesaas/app/ui/theme/Theme.kt',
                                      description: 'Binds DarkColorScheme mappings containing deep slates and emerald accents.',
                                      blueprintContent: `@Composable\nfun RechargeSaaSTheme(content: @Composable () -> Unit) {\n    MaterialTheme(colorScheme = DarkColorScheme, content = content)\n}`
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const API_GROUPS: APIGroup[] = [
  {
    groupName: 'Authentication & Session (REST v1)',
    description: 'Deals with secure multi-tenant identities, multi-factor logins, and token rotations.',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/register',
        description: 'Onboards a new platform member under standard customer roles or assist validations.',
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: `{\n  "email": "agent.smith@telecom.com",\n  "phone": "+15550199",\n  "password": "StrongSecurePassword123!",\n  "role": "RETAILER",\n  "kyc_assist": {\n    "doc_type": "NID_PASSPORT",\n    "doc_ref": "PASS-990142"\n  }\n}`,
        responseBody200: `{\n  "success": true,\n  "message": "User registered successfully, awaiting document validation.",\n  "user_id": "cfa8bc04-8b01-49e0-81f1-3be22ce87e04"\n}`,
        responseBody400: `{\n  "statusCode": 400,\n  "message": "Phone number is already registered.",\n  "error": "Bad Request"\n}`
      },
      {
        method: 'POST',
        path: '/api/v1/auth/login',
        description: 'Authenticates credentials and issues RS256 Bearer JWT Access and Refresh tokens.',
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: `{\n  "phone": "+15550199",\n  "password": "StrongSecurePassword123!"\n}`,
        responseBody200: `{\n  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "refresh_token": "def99831a4...",\n  "expires_in": 3600,\n  "mfa_required": false\n}`,
        responseBody400: `{\n  "statusCode": 401,\n  "message": "Invalid password credentials.",\n  "error": "Unauthorized"\n}`
      }
    ]
  },
  {
    groupName: 'Mobile Recharge Core (REST v1)',
    description: 'High-speed programmatic endpoints connecting local points of sales to global cellular airtimes.',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/recharges/execute',
        description: 'Initiates a balance verification, locks retailer ledger limits, and schedules high-speed operator executions.',
        requestHeaders: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJSUzI1...'
        },
        requestBody: `{\n  "recipient_number": "+15550199",\n  "operator_id": "d0e140d3-34bd-4ee4-90f7-b088e72750e4",\n  "package_id": "aa19cd91-90cf-4e5a-939e-dcb41cd2a392",\n  "amount": 15.0000,\n  "client_reference": "TXN_RETAIL_09912"\n}`,
        responseBody200: `{\n  "recharge_id": "f8a9cc01-90a4-44ed-9214-8fba44ea92d1",\n  "status": "QUEUED",\n  "recipient": "+15550199",\n  "deducted_balance": 15.0000,\n  "commission_earned": 0.3000,\n  "estimated_delivery": "1-3 seconds"\n}`,
        responseBody400: `{\n  "statusCode": 400,\n  "message": "Insufficient balance inside Main Wallet.",\n  "error": "Bad Request"\n}`
      },
      {
        method: 'GET',
        path: '/api/v1/recharges/status/:recharge_id',
        description: 'Enables real-time queries targeting active network statuses of specific recharges.',
        requestHeaders: { 'Authorization': 'Bearer eyJhbGci...' },
        responseBody200: `{\n  "recharge_id": "f8a9cc01-90a4-44ed-9214-8fba44ea92d1",\n  "recipient": "+15550199",\n  "amount": 15.0000,\n  "status": "SUCCESS",\n  "operator_ref": "OP_NET_990142A",\n  "completed_at": "2026-07-05T04:31:00Z"\n}`,
        responseBody400: `{\n  "statusCode": 404,\n  "message": "Recharge tracking ID not found.",\n  "error": "Not Found"\n}`
      }
    ]
  },
  {
    groupName: 'Platform Integration Webhooks',
    description: 'Enables external client servers to register hooks, receiving structural status messages for events.',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/webhooks/subscriptions',
        description: 'Registers a client listening URL callback to receive live recharge status events.',
        requestHeaders: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGci...'
        },
        requestBody: `{\n  "callback_url": "https://api.myretailshop.com/webhooks/telecom",\n  "subscribed_events": ["RECHARGE.SUCCESS", "RECHARGE.FAILED", "WALLET.TRANSFER"]\n}`,
        responseBody200: `{\n  "subscription_id": "web_sub_990142fa91",\n  "secret_signing_key": "whsec_A89Ff1293a9B912c...",\n  "status": "ACTIVE"\n}`,
        responseBody400: `{\n  "statusCode": 400,\n  "message": "Subscribed endpoint must use secure HTTPS protocols.",\n  "error": "Bad Request"\n}`
      }
    ]
  }
];
