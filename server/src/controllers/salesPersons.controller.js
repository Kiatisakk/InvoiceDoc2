// SalesPerson controller – CRUD handlers (list, get, create, update, delete)
import * as svc from "../services/salesPersons.service.js";
import { sendList, sendOne, sendCreated, sendOk, sendError } from "../utils/response.js";

// GET /api/sales-persons
export async function listSalesPersons(req, res) {
  try {
    const result = await svc.listSalesPersons(req.query);
    sendList(res, result);
  } catch (err) {
    sendError(res, err?.message ?? String(err), 500);
  }
}

// POST /api/sales-persons
export async function createSalesPerson(req, res) {
  try {
    const { code, name, start_work_date } = req.body;
    const result = await svc.createSalesPerson({ code, name, start_work_date });
    sendCreated(res, result);
  } catch (err) {
    sendError(res, err?.message ?? String(err), 400);
  }
}

// GET /api/sales-persons/:code
export async function getSalesPerson(req, res) {
  try {
    const code = decodeURIComponent(req.params.code || "");
    const row = await svc.getSalesPersonByCode(code);
    if (!row) return sendError(res, "Sales person not found", 404);
    sendOne(res, row);
  } catch (err) {
    sendError(res, err?.message ?? String(err), 500);
  }
}

// PUT /api/sales-persons/:code
export async function updateSalesPerson(req, res) {
  try {
    const code = decodeURIComponent(req.params.code || "");
    const existing = await svc.getSalesPersonByCode(code);
    if (!existing) return sendError(res, "Sales person not found", 404);
    const body = {
      code: req.body.code !== undefined ? req.body.code : existing.code,
      name: req.body.name !== undefined ? req.body.name : existing.name,
      start_work_date: req.body.start_work_date !== undefined ? req.body.start_work_date : existing.start_work_date,
    };
    const result = await svc.updateSalesPersonByCode(code, body);
    sendOk(res, result);
  } catch (err) {
    sendError(res, err?.message ?? String(err), 400);
  }
}

// DELETE /api/sales-persons/:code
export async function deleteSalesPerson(req, res) {
  try {
    const code = decodeURIComponent(req.params.code || "");
    const result = await svc.deleteSalesPersonByCode(code);
    if (!result) return sendError(res, "Sales person not found", 404);
    sendOk(res, result);
  } catch (err) {
    sendError(res, err?.message ?? String(err), 500);
  }
}
