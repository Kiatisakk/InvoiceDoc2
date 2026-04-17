## Page 1

Computer Engineering Department
King Mongkut’s University of Technology Thonburi
CPE 241 Database
Individual Lab #03 Add a simple UI. Modify Line Item. Refresh Calculations.
Date: Check Individual 03 assessment activities on LEB2
Introduction
In this lab, the focus shifts from observation to implementation by enhancing the existing
system with new features and improvements. The primary objective is to extend the
functionality of the application by introducing a Sales Person module, implementing
discount calculations at the line-item level, and updating invoice-level computations such
as totals and VAT. These enhancements require coordinated changes across the database
schema, application programming interfaces (APIs), and user interface (UI).
This lab simulates a real-world system upgrade scenario where modifications must be
applied incrementally without rebuilding the system from scratch. Through this process, we
gain practical experience in maintaining data consistency, implementing business logic,
and ensuring that all system components remain synchronized after updates.
Objectives
In this lab, you will extend your existing Individual Lab 2 system by adding:
• Sales person UI
• Line-level discount calculation
• Invoice-level totals and VAT calculation
This lab simulates a real production upgrade. You are NOT allowed to recreate the database
from scratch. You must apply changes using a delta script (e.g., invoice_lab3_delta.sql).

---

## Page 2

Instructions
1. Sales Person UI
You already created the sales_person table in Individual Lab 2. Now you must add full UI
support:
• Menu
o Add Sales Person to the main menu
o Default view from menu: List View
• List View
o Display: code, name, start_work_date. (id field is not shown)
• Form View
o Create new sales person
o Edit existing sales person
2. Invoice Line Enhancements to include Discounts
Enhance the invoice_line_item with pricing logic. After the Line Extended Price
(line_extended_price = quantity * unit_price) field, add the following 3 fields to the UI:
1) Editable: Line Discount Percent. line_discount_percent (numeric, default = 0.00)
2) Display Only: Line Discount Amount. line_discount_amount =
line_discount_percent * line_extended_price, rounded to nearest satang (2 decimal
places).
3) Display Only: Line Net Price. line_net_price = line_extended_price -
line_discount_amount
In invoice line item, the display order will be: line_extended_price → line_discount_percent
→ line_discount_amount → line_net_price
3. Invoice Header Calculations
Enhance the invoice header with totals to show these fields:
1) total_price = SUM(line_extended_price). Not Editable.
2) total_discount = SUM(line_discount_amount). Not Editable.
3) net_price = (total_price - total_discount). Not Editable.
4) vat_percent - in your database add a new table called “configuration” with field
vat_percent set to 7%. Read this field from there and set it here as a default
value. Editable.
5) vat_amount = net_price * vat_percent, rounded to 2 decimal places. Not
Editable.
6) amount_due = net_price + vat_amount. Not Editable.

---

## Page 3

Notes
• VAT % should be editable (default can be read from configuration).
• All totals should be auto-calculated.
• All monetary values must be rounded to 2 decimal places.
4. API Changes
You must update your APIs to:
• Accept line_discount_percent
• Return: line_extended_price, line_discount_amount, line_net_price, total_price,
total_discount, vat_amount, amount_due
5. Database Changes
You must implement database schema updates (Individual Lab 2 to 3) using:
invoice_lab3_delta.sql
This must include all your SQL statements to create table, alter table, add constraints, etc.
6. Common Mistakes
• Forgetting rounding → wrong totals
• Making calculated fields editable → wrong design
• Not updating APIs → UI mismatch
• Hardcoding totals in UI → instant fail logic

---

## Page 4

Deliverables
Submit ONE PDF file containing ALL items below:
1. Screenshots
1) Show at least 10 records of Sales Person List View.
2) Show form views with data in it for 2 saved Sales Person codes.
3) Invoice Form with Discounts
• At least 2 newly created invoices with 2-3 line items, each with
discount %, discount amount, net price. The header totals should be
correct.
4) All invoice reports affected by the line item and header discount values:
printed invoice, invoice reports that show amount due should also show
discount, invoice reports that show line items should also show line item
discounts.
2. Code Submission
1) Showing invoice_lab3_delta.sql that must include all schema changes from
Individual Lab 2 to Invoice Lab 3
2) Include only modified or new APIs. Do not dump the entire project.
3) Show the parts of your code in each tier that’s used to calculate the line item
totals and invoice header totals:
a) UI code
b) API code
c) DB code - only if you updated totals using SQL code (most people do
all of it in the API layer)

---

## Page 5

Invoice Mock Up Screen for Individual Lab 2:
Sales Invoice (Lab 2)
Sales Invoice No.: _INV26-001__ (Auto-run) *Date: _15/01/2026_
*Customer: __ABC__ Customer Name: _ABC Co., Ltd.__
Sales Person: _PUI33__ Sales Person Name: _Ngaam Chakrawaan__
[Add Row]
N *Product Code *Product Name *Unit *Qty Units Extend
o Price ed
Price
1 5,000.0 [Del][Ad
d]
0
2 300.00 [Del][Ad
d]
3 [Del][Ad
d]
4 [Del][Ad
d]
Total Price VAT % VAT Amount Amount Due
(default 7%)

|  |  |  |  |  |  |
| Sales Invoice (Lab 2) |  |  |  |  |  |
|  |  |  |  |  |  |

| N o | *Product Code | *Product Name | *Unit Price | *Qty | Units |  | Extend |  |  |  |  |
|  |  |  |  |  |  |  | ed |  |  |  |  |
|  |  |  |  |  |  |  | Price |  |  |  |  |
| 1 |  |  |  |  |  |  | 5,000.0 |  | [Del][Ad d] |  |  |
|  |  |  |  |  |  |  | 0 |  |  |  |  |
| 2 |  |  |  |  |  | 300.00 | 300.00 |  |  | [Del][Ad d] |  |
|  |  |  |  |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |  | [Del][Ad d] |  |
|  |  |  |  |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |  | [Del][Ad d] |  |
|  |  |  |  |  |  |  |  |  |  |  |  |

| N |
| o |

| *Unit |
| Price |

|  | Total Price |  |  | VAT % |  |  | VAT Amount |  |  | Amount Due |  |
|  |  |  | (default 7%) |  |  |  |  |  |  |  |  |

---

## Page 6

Invoice Mock Up Screen for Individual Lab 3:
Sales Invoice (Lab 3)
Sales Invoice No.: _INV26-001__ (Auto-run) *Date: _15/01/2026_
*Customer: __ABC__ Customer Name: _ABC Co., Ltd.__
Sales Person: _PUI33__ Sales Person Name: _Ngaam Chakrawaan__
[Add Row]
N *Produc *Product *Unit *Qty Units Extend Discoun Discou Net
o t Code Name Price ed t % nt Price
Price Amount
1 [Del][Add]
2 [Del][Add]
3 [Del][Add]
4 [Del][Add]
Total Price Total Net Price VAT % VAT Amount Amount Due
Discount
(default 7%)
Final Submission
• Submit a PDF file and ensure it is named appropriately (e.g.,
IND0 3_Your StudentID .pdf ) then submit the report on LEB2 before the deadline.
• Upload the PDF report to the Assessment Activities section for Individual02 on LEB2.

|  |  |  |  |  |  |
| Sales Invoice (Lab 3) |  |  |  |  |  |
|  |  |  |  |  |  |

| N o |  |  | *Produc t Code |  |  | *Product Name |  |  | *Unit Price |  |  | *Qty |  |  | Units |  |  |  | Extend |  | Discoun t % |  |  |  | Discou |  | Net Price |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ed |  |  |  |  |  | nt |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | Price |  |  |  |  |  | Amount |  |  |  |  |  |  |  |
|  | 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [Del][Add] |  |  |
| 2 | 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [Del][Add] |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [Del][Add] |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [Del][Add] |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

| N |
| o |

| *Produc |
| t Code |

| *Product |
| Name |

| *Unit |
| Price |

| Discoun |
| t % |

| Net |
| Price |

| Total Price |  | Total |  | Net Price | VAT % | VAT Amount | Amount Due |
|  |  | Discount |  |  |  |  |  |
|  |  |  |  |  | (default 7%) |  |  |

---

