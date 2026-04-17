import { http } from "./http.js";

function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listSalesPersons(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/sales-persons${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

// เพิ่มฟังก์ชันนี้เพื่อดึงชื่อจาก Code
export async function getSalesPerson(code) {
  const res = unwrap(await http(`/api/sales-persons?search=${encodeURIComponent(code)}&limit=1`));
  return res.data && res.data.length > 0 ? res.data[0] : null;
}
