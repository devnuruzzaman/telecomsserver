-- ========================================================
-- ENTERPRISE TELECOM RECHARGE & BILLING SaaS PLATFORM
-- PRODUCTION-GRADE POSTGRESQL DATABASE SCHEMA (DDL)
-- Target: PostgreSQL 15 or 16+ (Normalized and fully indexed)
-- ========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom Enum Types
CREATE TYPE "Role" AS ENUM (
  'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'DISTRIBUTOR', 'MASTER_DEALER', 
  'DEALER', 'RETAILER', 'AGENT', 'CUSTOMER', 'SUPPORT', 'FINANCE'
);

CREATE TYPE "RechargeStatus" AS ENUM (
  'INITIATED', 'QUEUED', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED'
);

CREATE TYPE "RechargeType" AS ENUM (
  'PREPAID', 'POSTPAID'
);

CREATE TYPE "PackageType" AS ENUM (
  'DATA', 'VOICE', 'SMS', 'COMBO', 'OFFER'
);

CREATE TYPE "KYCStatus" AS ENUM (
  'PENDING', 'APPROVED', 'REJECTED', 'RE_SUBMISSION_REQUIRED'
);

CREATE TYPE "TransactionType" AS ENUM (
  'CREDIT', 'DEBIT'
);

CREATE TYPE "TransactionPurpose" AS ENUM (
  'RECHARGE', 'RECHARGE_COMMISSION', 'CASHBACK', 'WALLET_TRANSFER', 
  'TOPUP', 'REFUND', 'SYSTEM_ADJUSTMENT'
);

CREATE TYPE "TicketStatus" AS ENUM (
  'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
);

CREATE TYPE "NotificationChannel" AS ENUM (
  'SMS', 'EMAIL', 'WHATSAPP', 'PUSH'
);

-- ========================================================
-- 1. Table: users
-- ========================================================
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "phone" VARCHAR(20) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "kyc_status" "KYCStatus" NOT NULL DEFAULT 'PENDING',
  "two_factor_secret" VARCHAR(100) NULL,
  "is_two_factor_enabled" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ NULL
);

-- Indexes for users
CREATE INDEX "idx_users_role" ON "users" ("role");
CREATE INDEX "idx_users_kyc_status" ON "users" ("kyc_status");
CREATE INDEX "idx_users_deleted_at" ON "users" ("deleted_at") WHERE "deleted_at" IS NULL;

-- ========================================================
-- 2. Table: profiles
-- ========================================================
CREATE TABLE "profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID UNIQUE NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "company_name" VARCHAR(150) NULL,
  "address" TEXT NULL,
  "city" VARCHAR(100) NULL,
  "country" VARCHAR(100) NULL,
  "avatar_url" VARCHAR(512) NULL,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 3. Table: wallets
-- ========================================================
CREATE TABLE "wallets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID UNIQUE NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "main_balance" DECIMAL(15, 4) NOT NULL DEFAULT 0.0000,
  "commission_balance" DECIMAL(15, 4) NOT NULL DEFAULT 0.0000,
  "cashback_balance" DECIMAL(15, 4) NOT NULL DEFAULT 0.0000,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 4. Table: transactions (Double-Entry General Ledger)
-- ========================================================
CREATE TABLE "transactions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "wallet_id" UUID NOT NULL REFERENCES "wallets" ("id") ON DELETE CASCADE,
  "type" "TransactionType" NOT NULL,
  "purpose" "TransactionPurpose" NOT NULL,
  "amount" DECIMAL(15, 4) NOT NULL,
  "previous_balance" DECIMAL(15, 4) NOT NULL,
  "current_balance" DECIMAL(15, 4) NOT NULL,
  "reference_id" UUID NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for transactions
CREATE INDEX "idx_transactions_wallet_id" ON "transactions" ("wallet_id");
CREATE INDEX "idx_transactions_type" ON "transactions" ("type");
CREATE INDEX "idx_transactions_purpose" ON "transactions" ("purpose");
CREATE INDEX "idx_transactions_ref_id" ON "transactions" ("reference_id");

-- ========================================================
-- 5. Table: operators
-- ========================================================
CREATE TABLE "operators" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) UNIQUE NOT NULL,
  "code" VARCHAR(20) UNIQUE NOT NULL,
  "country_code" VARCHAR(5) NOT NULL,
  "logo_url" VARCHAR(512) NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for operators
CREATE INDEX "idx_operators_code" ON "operators" ("code");
CREATE INDEX "idx_operators_country_code" ON "operators" ("country_code");

-- ========================================================
-- 6. Table: packages
-- ========================================================
CREATE TABLE "packages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "operator_id" UUID NOT NULL REFERENCES "operators" ("id") ON DELETE CASCADE,
  "name" VARCHAR(150) NOT NULL,
  "type" "PackageType" NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "validity_days" INT NOT NULL,
  "description" TEXT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for packages
CREATE INDEX "idx_packages_operator_type" ON "packages" ("operator_id", "type");

-- ========================================================
-- 7. Table: recharges
-- ========================================================
CREATE TABLE "recharges" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users" ("id"),
  "operator_id" UUID NOT NULL REFERENCES "operators" ("id"),
  "package_id" UUID NULL REFERENCES "packages" ("id"),
  "recipient_number" VARCHAR(30) NOT NULL,
  "amount" DECIMAL(12, 4) NOT NULL,
  "status" "RechargeStatus" NOT NULL DEFAULT 'INITIATED',
  "type" "RechargeType" NOT NULL DEFAULT 'PREPAID',
  "gateway_reference" VARCHAR(255) NULL,
  "gateway_response" JSONB NULL,
  "attempts" INT NOT NULL DEFAULT 1,
  "client_reference" VARCHAR(100) NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "completed_at" TIMESTAMPTZ NULL
);

-- Indexes for recharges
CREATE INDEX "idx_recharges_user_id" ON "recharges" ("user_id");
CREATE INDEX "idx_recharges_status_created" ON "recharges" ("status", "created_at");
CREATE INDEX "idx_recharges_recipient" ON "recharges" ("recipient_number");

-- ========================================================
-- 8. Table: commission_rules
-- ========================================================
CREATE TABLE "commission_rules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "role" "Role" NOT NULL,
  "operator_id" UUID NULL REFERENCES "operators" ("id") ON DELETE SET NULL,
  "package_id" UUID NULL REFERENCES "packages" ("id") ON DELETE SET NULL,
  "percentage" DECIMAL(5, 2) NOT NULL, -- e.g. 2.50
  "flat_rate" DECIMAL(10, 4) NOT NULL DEFAULT 0.0000,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "uq_commission_rule" UNIQUE ("role", "operator_id", "package_id")
);

-- ========================================================
-- 9. Table: commission_distributions
-- ========================================================
CREATE TABLE "commission_distributions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "recharge_id" UUID NOT NULL REFERENCES "recharges" ("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "amount" DECIMAL(12, 4) NOT NULL,
  "percentage" DECIMAL(5, 2) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_comm_dist_recharge" ON "commission_distributions" ("recharge_id");
CREATE INDEX "idx_comm_dist_user" ON "commission_distributions" ("user_id");

-- ========================================================
-- 10. Table: kyc_verifications
-- ========================================================
CREATE TABLE "kyc_verifications" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "document_type" VARCHAR(50) NOT NULL,
  "document_ref" VARCHAR(100) NOT NULL,
  "front_img_url" VARCHAR(512) NOT NULL,
  "back_img_url" VARCHAR(512) NULL,
  "status" "KYCStatus" NOT NULL DEFAULT 'PENDING',
  "verified_by" UUID NULL REFERENCES "users" ("id") ON DELETE SET NULL,
  "notes" TEXT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_kyc_user_id" ON "kyc_verifications" ("user_id");
CREATE INDEX "idx_kyc_status" ON "kyc_verifications" ("status");

-- ========================================================
-- 11. Table: api_keys
-- ========================================================
CREATE TABLE "api_keys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "name" VARCHAR(100) NOT NULL,
  "key_prefix" VARCHAR(8) UNIQUE NOT NULL,
  "key_hash" VARCHAR(255) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "expires_at" TIMESTAMPTZ NULL
);

CREATE INDEX "idx_api_keys_user" ON "api_keys" ("user_id");

-- ========================================================
-- 12. Table: webhook_subscriptions
-- ========================================================
CREATE TABLE "webhook_subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "callback_url" VARCHAR(512) NOT NULL,
  "secret_signing_key" VARCHAR(255) NOT NULL,
  "subscribed_events" TEXT[] NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_webhook_subs_user" ON "webhook_subscriptions" ("user_id");

-- ========================================================
-- 13. Table: support_tickets
-- ========================================================
CREATE TABLE "support_tickets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "customer_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "assigned_to" UUID NULL REFERENCES "users" ("id") ON DELETE SET NULL,
  "subject" VARCHAR(255) NOT NULL,
  "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_tickets_customer" ON "support_tickets" ("customer_id");
CREATE INDEX "idx_tickets_status" ON "support_tickets" ("status");

-- ========================================================
-- 14. Table: live_chat_messages
-- ========================================================
CREATE TABLE "live_chat_messages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "ticket_id" UUID NOT NULL REFERENCES "support_tickets" ("id") ON DELETE CASCADE,
  "sender_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_chat_messages_ticket" ON "live_chat_messages" ("ticket_id");

-- ========================================================
-- 15. Table: notifications
-- ========================================================
CREATE TABLE "notifications" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "channel" "NotificationChannel" NOT NULL,
  "title" VARCHAR(150) NOT NULL,
  "content" TEXT NOT NULL,
  "is_sent" BOOLEAN NOT NULL DEFAULT FALSE,
  "sent_at" TIMESTAMPTZ NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_notifications_user" ON "notifications" ("user_id");
CREATE INDEX "idx_notifications_channel" ON "notifications" ("channel");

-- ========================================================
-- 16. Table: audit_logs
-- ========================================================
CREATE TABLE "audit_logs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NULL REFERENCES "users" ("id") ON DELETE SET NULL,
  "action" VARCHAR(100) NOT NULL,
  "ip_address" VARCHAR(45) NOT NULL,
  "user_agent" VARCHAR(255) NULL,
  "old_values" JSONB NULL,
  "new_values" JSONB NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_audit_logs_user_action" ON "audit_logs" ("user_id", "action");

-- ========================================================
-- DATABASE SYSTEM TRIGGERS & PROCEDURES (SHADOW AUDITING)
-- ========================================================

-- Procedure: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON "users"
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON "profiles"
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_kyc
BEFORE UPDATE ON "kyc_verifications"
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_tickets
BEFORE UPDATE ON "support_tickets"
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Trigger for Wallet Auditing
CREATE OR REPLACE FUNCTION log_wallet_update_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "audit_logs" (user_id, action, ip_address, old_values, new_values)
  VALUES (
    NEW.user_id, 
    'WALLET_BALANCE_ADJUST', 
    '127.0.0.1',
    row_to_json(OLD),
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wallet_balance_audit_trigger
AFTER UPDATE OF "main_balance", "commission_balance", "cashback_balance" ON "wallets"
FOR EACH ROW EXECUTE PROCEDURE log_wallet_update_audit();
