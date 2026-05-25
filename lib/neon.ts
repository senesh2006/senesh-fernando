import { neon } from "@neondatabase/serverless"

let sql: ReturnType<typeof neon> | null = null

export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is not configured")
  }

  if (!sql) {
    sql = neon(url)
  }

  return sql
}

export async function ensureSchema() {
  const db = getSql()

  await db`
    CREATE TABLE IF NOT EXISTS portfolio_documents (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      collection_name TEXT NOT NULL,
      body JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await db`
    CREATE INDEX IF NOT EXISTS idx_portfolio_documents_collection
    ON portfolio_documents (collection_name)
  `

  await db`
    CREATE TABLE IF NOT EXISTS visitor_stats (
      id TEXT PRIMARY KEY,
      total_views INTEGER NOT NULL DEFAULT 0,
      unique_visitors INTEGER NOT NULL DEFAULT 0,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}
