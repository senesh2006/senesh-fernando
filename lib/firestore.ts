import { ensureSchema, getSql } from "@/lib/neon"

export type FirestoreRecord = Record<string, unknown> & { id: string }

const COLLECTIONS = new Set([
  "projects",
  "blogs",
  "experience",
  "education",
  "skills",
  "achievements",
  "recommendations",
])

let schemaReady: Promise<void> | null = null

async function ready() {
  if (!schemaReady) {
    schemaReady = ensureSchema()
  }
  await schemaReady
}

function rowToRecord(row: {
  id: string
  body: unknown
  created_at: string | Date
  updated_at?: string | Date | null
}): FirestoreRecord {
  const body =
    typeof row.body === "object" && row.body !== null && !Array.isArray(row.body)
      ? (row.body as Record<string, unknown>)
      : {}

  return {
    id: row.id,
    ...body,
    created_at: new Date(row.created_at).toISOString(),
    ...(row.updated_at
      ? { updated_at: new Date(row.updated_at).toISOString() }
      : {}),
  }
}

function assertCollection(collectionName: string) {
  if (!COLLECTIONS.has(collectionName)) {
    throw new Error(`Unsupported collection: ${collectionName}`)
  }
}

export async function listCollection(
  collectionName: string,
  sort?: (a: FirestoreRecord, b: FirestoreRecord) => number
): Promise<FirestoreRecord[]> {
  await ready()
  assertCollection(collectionName)

  const rows = await getSql()`
    SELECT id, body, created_at, updated_at
    FROM portfolio_documents
    WHERE collection_name = ${collectionName}
  `

  const records = rows.map((row) =>
    rowToRecord(row as { id: string; body: unknown; created_at: string | Date; updated_at?: string | Date })
  )

  return sort ? records.sort(sort) : records
}

export async function getDocument(
  collectionName: string,
  id: string
): Promise<FirestoreRecord | null> {
  await ready()
  assertCollection(collectionName)

  const rows = await getSql()`
    SELECT id, body, created_at, updated_at
    FROM portfolio_documents
    WHERE collection_name = ${collectionName} AND id = ${id}
    LIMIT 1
  `

  const row = rows[0]
  if (!row) return null

  return rowToRecord(row as { id: string; body: unknown; created_at: string | Date; updated_at?: string | Date })
}

export async function createDocument(
  collectionName: string,
  data: Record<string, unknown>
): Promise<FirestoreRecord> {
  await ready()
  assertCollection(collectionName)

  const rows = await getSql()`
    INSERT INTO portfolio_documents (collection_name, body)
    VALUES (${collectionName}, ${JSON.stringify(data)}::jsonb)
    RETURNING id, body, created_at, updated_at
  `

  return rowToRecord(rows[0] as { id: string; body: unknown; created_at: string | Date; updated_at?: string | Date })
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<FirestoreRecord | null> {
  await ready()
  assertCollection(collectionName)

  const rows = await getSql()`
    UPDATE portfolio_documents
    SET body = ${JSON.stringify(data)}::jsonb,
        updated_at = NOW()
    WHERE collection_name = ${collectionName} AND id = ${id}
    RETURNING id, body, created_at, updated_at
  `

  const row = rows[0]
  if (!row) return null

  return rowToRecord(row as { id: string; body: unknown; created_at: string | Date; updated_at?: string | Date })
}

export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<boolean> {
  await ready()
  assertCollection(collectionName)

  const rows = await getSql()`
    DELETE FROM portfolio_documents
    WHERE collection_name = ${collectionName} AND id = ${id}
    RETURNING id
  `

  return rows.length > 0
}

export async function incrementField(
  collectionName: string,
  id: string,
  field: string,
  amount = 1
): Promise<number | null> {
  await ready()
  assertCollection(collectionName)

  const existing = await getDocument(collectionName, id)

  if (!existing) {
    const created = await createDocument(collectionName, { [field]: amount })
    return Number(created[field] ?? amount)
  }

  const body = { ...existing }
  delete body.id
  delete body.created_at
  delete body.updated_at

  const nextValue = Number(body[field] ?? 0) + amount
  body[field] = nextValue

  const updated = await updateDocument(collectionName, id, body)
  return updated ? Number(updated[field] ?? nextValue) : null
}

export function sortByOrderThenDate(
  a: FirestoreRecord,
  b: FirestoreRecord
) {
  const orderDiff =
    Number(a.order_index ?? 0) - Number(b.order_index ?? 0)
  if (orderDiff !== 0) return orderDiff
  return String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""))
}

export function sortByDateDesc(a: FirestoreRecord, b: FirestoreRecord) {
  return String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""))
}
