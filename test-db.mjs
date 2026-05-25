import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

try {
  const result = await sql`SELECT 1 as test`;
  console.log("[v0] Database connection successful!");
  console.log("[v0] Test query result:", result);
  
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log("[v0] Database tables:", tables);
} catch (error) {
  console.error("[v0] Database connection failed:", error.message);
}
