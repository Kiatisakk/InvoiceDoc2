import { pool } from "../db/pool.js";

export async function getSalesPersons({ search, page, limit }) {
  const offset = (Number(page) - 1) * Number(limit);
  const searchParam = `%${search}%`;

  // query 1: นับ total
  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM sales_person
     WHERE code ILIKE $1 OR name ILIKE $1`,
    [searchParam],
  );

  // query 2: ดึง rows
  const { rows } = await pool.query(
    `SELECT *
     FROM sales_person
     WHERE code ILIKE $1 OR name ILIKE $1
     ORDER BY code ASC
     LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset],
  );

  return { 
    data: rows, 
    total: Number(countResult.rows[0].total), 
    page: Number(page), 
    limit: Number(limit), 
    totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit)) 
  };
}
