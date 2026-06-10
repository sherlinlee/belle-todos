import { head, put } from "@vercel/blob";
import type { BelleSyncData } from "@/lib/sync-types";

const BLOB_PATHNAME = "belle-sync.json";

function authHeaders(): HeadersInit | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return undefined;
  return { authorization: `Bearer ${token}` };
}

export async function loadSyncData(): Promise<BelleSyncData | null> {
  try {
    const meta = await head(BLOB_PATHNAME);
    const res = await fetch(meta.url, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as BelleSyncData;
  } catch {
    return null;
  }
}

export async function saveSyncData(data: BelleSyncData): Promise<boolean> {
  try {
    await put(BLOB_PATHNAME, JSON.stringify(data), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return true;
  } catch {
    return false;
  }
}
