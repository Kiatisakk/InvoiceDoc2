// Client-side API for configuration — fetches values from /api/config/:key
// Used to read settings like vat_percent from the backend.
import { http } from "./http.js";

function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function getConfig(key) {
  const res = unwrap(await http(`/api/config/${encodeURIComponent(key)}`));
  return res.data?.value ?? null;
}
