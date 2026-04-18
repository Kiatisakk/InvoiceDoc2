# Lab 3 Submission Plan

Here is a step-by-step plan on what you need to gather for your final PDF submission (`IND03_YourStudentID.pdf`), along with exactly which files and code snippets to use. 

> [!NOTE]
> Since this is a learning exercise, we will go over exactly *where* to find your work so you can compile it into your PDF document.

## 1. Screenshots Required
You need to run your application and take the following screenshots:
1. **Sales Person List View:** Go to the Sales Person page and take a screenshot showing at least 10 records.
2. **Sales Person Form View:** Open the edit/create form for 2 different Sales Persons and take screenshots of the filled-out forms.
3. **Invoice Form with Discounts:** Create at least 2 new invoices. Add 2-3 line items to each. Make sure you enter a discount percent so the discount amount and net price are calculated. Take a screenshot showing the line items and the correct header totals at the bottom.
4. **Reports:** Go to the Reports page and take screenshots showing how the discounts affect the totals (e.g., Sales by Product, Monthly Sales, and the Printed Invoice view if you have one).

## 2. Code Submission Requirements

You must include specific parts of your code in the PDF. Here is exactly what to grab:

### A) Database Changes (`invoice_lab3_delta.sql`)
You need to include the entire contents of your delta script.
- **File:** `database/sql/invoice_lab3_delta.sql`
- **What it does:** Shows how you added the `configuration` table, added discount/net price columns to `invoice_line_item`, and added totals/VAT columns to `invoice`.

### B) New or Modified APIs
Include the API code that you added or changed for this lab. *Do not include the whole project!*
- **Configuration API (New):** 
  - `server/src/controllers/configuration.controller.js`
  - `server/src/services/configuration.service.js`
  - `server/src/routes/configuration.routes.js`
- **Sales Person API (New):**
  - `server/src/controllers/salesPersons.controller.js`
  - `server/src/services/salesPersons.service.js`
  - `server/src/routes/salesPersons.routes.js`
- **Invoice API (Modified to include discounts & VAT):**
  - `server/src/models/invoice.model.js` (Where you added `line_discount_percent` and `sales_person_code`)
  - `server/src/services/invoices.service.js` (The `enrichLineItems`, `createInvoice`, and `updateInvoice` functions)

### C) Calculation Logic (The "Math" Parts)
The lab specifically asks to see how you calculate line-item totals and header totals.

**1. UI Code (Frontend Calculations)**
- **File:** `client/src/components/LineItemsEditor.jsx`
  - Look for functions: `computeExtended`, `computeDiscountAmount`, and `computeNetPrice` (around line 148).
  - Also include the `total`, `totalDiscount`, and `totalNetPrice` reductions (around line 164).
- **File:** `client/src/components/InvoiceForm.jsx`
  - Look for the calculation block around line 87: `totalExtended`, `totalDiscount`, `netPrice`, `vatAmount`, and `amountDue`.

**2. API Code (Backend Calculations)**
- **File:** `server/src/services/invoices.service.js`
  - Look for the `enrichLineItems` function (around line 63). This is where the backend calculates `extended_price`, `line_discount_amount`, and `line_net_price` for each row.
  - Look inside `createInvoice` and `updateInvoice` (around line 110 and 153). This is where the backend calculates `total_price`, `total_discount`, `net_price`, `vat_amount`, and `amount_due`.

**3. DB Code**
- You do *not* need to submit DB calculation code because you implemented the math in the API and UI layers (which is the recommended approach!).

---

### Next Steps:
1. Open a Word or Google Doc.
2. Paste the screenshots into the document.
3. Copy the SQL code and the Javascript calculation functions mentioned above, and paste them under clear headings.
4. Export the document as a PDF named `IND03_YourStudentID.pdf`.
5. Submit it to LEB2!
