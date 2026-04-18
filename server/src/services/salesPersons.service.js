// SalesPerson CRUD and list (search by code/name, pagination, sort). Parameterized queries only.
import { pool } from "../db/pool.js";

export async function listSalesPersons({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "name",
  sortDir = "asc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["code", "name", "start_work_date"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "name";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as total FROM sales_person
      WHERE code ILIKE $1 OR name ILIKE $1
    `,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `
      SELECT code, name, start_work_date, created_at
      FROM sales_person
      WHERE code ILIKE $1 OR name ILIKE $1
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST
      LIMIT $2 OFFSET $3
    `,
    [searchParam, Number(limit), offset],
  );

  return {
    data: rows,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
}

export async function createSalesPerson({
  code,
  name,
  start_work_date,
} = {}) {
  let resolvedCode = code;

  if (!resolvedCode || String(resolvedCode).trim() === "") {
    const maxRes = await pool.query("SELECT MAX(id) as m FROM sales_person");
    const nextId = (maxRes.rows[0].m || 0) + 1;
    resolvedCode = `SP${nextId.toString().padStart(3, "0")}`;
  }

  await pool.query(
    "INSERT INTO sales_person (code, name, start_work_date) VALUES ($1, $2, $3)",
    [resolvedCode, name, start_work_date],
  );

  return { code: resolvedCode };
}

export async function updateSalesPerson(
  id,
  { code, name, start_work_date } = {},
) {
  // If code is empty (e.g. frontend "auto" on edit), keep existing to avoid unique constraint
  let resolvedCode = (code != null && String(code).trim() !== "") ? String(code).trim() : null;
  if (resolvedCode === null) {
    const cur = await pool.query("SELECT code FROM sales_person WHERE id=$1", [id]);
    resolvedCode = cur.rowCount > 0 ? cur.rows[0].code : `SP${id}`;
  }
  await pool.query(
    "UPDATE sales_person SET code=$1, name=$2, start_work_date=$3 WHERE id=$4",
    [resolvedCode, name, start_work_date, id],
  );
  return { ok: true };
}

export async function deleteSalesPerson(id) {
  await pool.query("DELETE FROM sales_person WHERE id=$1", [id]);
  return { ok: true };
}

export async function getSalesPersonById(id) {
  const { rows } = await pool.query(
    `SELECT id, code, name, start_work_date, created_at
     FROM sales_person
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

/** Get sales_person by business key (code). Used by API so frontend does not send primary key. */
export async function getSalesPersonByCode(code) {
  if (!code || String(code).trim() === "") return null;
  const { rows } = await pool.query(
    `SELECT id, code, name, start_work_date, created_at
     FROM sales_person
     WHERE code = $1`,
    [String(code).trim()]
  );
  return rows[0] ?? null;
}

/** Resolve sales_person code to id (internal use only; id never sent to client). */
export async function resolveSalesPersonId(code) {
  const r = await pool.query("SELECT id FROM sales_person WHERE code = $1", [String(code).trim()]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function updateSalesPersonByCode(code, body) {
  const id = await resolveSalesPersonId(code);
  if (id == null) return null;
  await updateSalesPerson(id, body);
  return { ok: true };
}

export async function deleteSalesPersonByCode(code, opts = {}) {
  const id = await resolveSalesPersonId(code);
  if (id == null) return null;
  await deleteSalesPerson(id, opts);
  return { ok: true };
}

