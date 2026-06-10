import { get, put } from "@vercel/blob";
import type { BelleSyncData } from "@/lib/sync-types";

const BLOB_PATHNAME = "belle-sync.json";

export async function loadSyncData(): Promise<BelleSyncData | null> {
  try {
    const result = await get(BLOB_PATHNAME, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;

    const text = await new Response(result.stream).text();
    return JSON.parse(text) as BelleSyncData;
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
