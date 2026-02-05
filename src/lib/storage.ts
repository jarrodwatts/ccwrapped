import { kv } from "@vercel/kv";
import { storedWrappedSchema } from "@/lib/types";
import type { StoredWrapped } from "@/lib/types";

export async function getWrapped(slug: string): Promise<StoredWrapped | null> {
  const raw = await kv.get<string>(`wrapped:${slug}`);
  if (!raw) return null;

  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  const result = storedWrappedSchema.safeParse(parsed);
  if (!result.success) return null;

  return result.data;
}
