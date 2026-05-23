import {
  FieldValue,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase-admin/firestore"
import { getFirestoreDb } from "@/lib/firebase-admin"

export type FirestoreRecord = DocumentData & { id: string }

function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (value instanceof Date) return value.toISOString()
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as Timestamp).toDate().toISOString()
  }
  if (Array.isArray(value)) {
    return value.map(serializeValue)
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        serializeValue(v),
      ])
    )
  }
  return value
}

export function docToRecord(
  doc: QueryDocumentSnapshot<DocumentData>
): FirestoreRecord {
  const data = doc.data()
  return serializeValue({ id: doc.id, ...data }) as FirestoreRecord
}

export async function listCollection(
  collectionName: string,
  sort?: (a: FirestoreRecord, b: FirestoreRecord) => number
): Promise<FirestoreRecord[]> {
  const snapshot = await getFirestoreDb().collection(collectionName).get()
  const records = snapshot.docs.map(docToRecord)
  return sort ? records.sort(sort) : records
}

export async function getDocument(
  collectionName: string,
  id: string
): Promise<FirestoreRecord | null> {
  const doc = await getFirestoreDb().collection(collectionName).doc(id).get()
  if (!doc.exists) return null
  return docToRecord(doc as QueryDocumentSnapshot<DocumentData>)
}

export async function createDocument(
  collectionName: string,
  data: DocumentData
): Promise<FirestoreRecord> {
  const payload = {
    ...data,
    created_at: FieldValue.serverTimestamp(),
  }
  const ref = await getFirestoreDb().collection(collectionName).add(payload)
  const created = await ref.get()
  return docToRecord(created as QueryDocumentSnapshot<DocumentData>)
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: DocumentData
): Promise<FirestoreRecord | null> {
  const ref = getFirestoreDb().collection(collectionName).doc(id)
  const existing = await ref.get()
  if (!existing.exists) return null

  await ref.update({
    ...data,
    updated_at: FieldValue.serverTimestamp(),
  })

  const updated = await ref.get()
  return docToRecord(updated as QueryDocumentSnapshot<DocumentData>)
}

export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<boolean> {
  const ref = getFirestoreDb().collection(collectionName).doc(id)
  const existing = await ref.get()
  if (!existing.exists) return false
  await ref.delete()
  return true
}

export async function incrementField(
  collectionName: string,
  id: string,
  field: string,
  amount = 1
): Promise<number | null> {
  const ref = getFirestoreDb().collection(collectionName).doc(id)
  const existing = await ref.get()

  if (!existing.exists) {
    await ref.set({
      [field]: amount,
      created_at: FieldValue.serverTimestamp(),
    })
    return amount
  }

  await ref.update({
    [field]: FieldValue.increment(amount),
    updated_at: FieldValue.serverTimestamp(),
  })

  const updated = await ref.get()
  return (updated.data()?.[field] as number) ?? null
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
