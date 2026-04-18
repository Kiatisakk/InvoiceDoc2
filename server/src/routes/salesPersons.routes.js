// Sales Person API routes
// Example usage: GET /api/sales-persons
import { Router } from "express";
import * as c from "../controllers/salesPersons.controller.js";

const r = Router();

r.get("/", c.listSalesPersons);       // List + search + pagination
r.post("/", c.createSalesPerson);      // Create new
r.get("/:code", c.getSalesPerson);     // Get by code
r.put("/:code", c.updateSalesPerson);  // Update by code
r.delete("/:code", c.deleteSalesPerson); // Delete by code

export default r;
