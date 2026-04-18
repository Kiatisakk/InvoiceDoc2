// Invoice form (create/edit) with customer select and line items
import React from "react";
import LineItemsEditor from "./LineItemsEditor.jsx";
import CustomerPickerModal from "./CustomerPickerModal.jsx";
import SalesPersonPickerModal from "./SalesPersonPickerModal.jsx";
import { AlertModal } from "./Modal.jsx";
import { getCustomer } from "../api/customers.api.js";
import { getConfig } from "../api/configuration.api.js";
import { formatBaht } from "../utils.js";

export default function InvoiceForm({ onSubmit, submitting, initialData }) {
  const [invoiceNo, setInvoiceNo] = React.useState("");
  const [customerCode, setCustomerCode] = React.useState("");
  const [invoiceDate, setInvoiceDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [vatPercent, setVatPercent] = React.useState(7);   // 7 means 7%
  const [items, setItems] = React.useState([{ product_code: "", quantity: 1, unit_price: 0 }]);
  const [alertModal, setAlertModal] = React.useState({ isOpen: false, title: "Validation Error", message: "" });
  
  const [customerModalOpen, setCustomerModalOpen] = React.useState(false);
  const [customerDetails, setCustomerDetails] = React.useState(null);
  const [customerLoadError, setCustomerLoadError] = React.useState("");

  // New states for Sales Person
  const [salesPersonCode, setSalesPersonCode] = React.useState("");
  const [salesPersonName, setSalesPersonName] = React.useState("");
  const [salesPersonModalOpen, setSalesPersonModalOpen] = React.useState(false);

  React.useEffect(() => {
    const code = String(customerCode || "").trim();
    if (!code) {
      setCustomerDetails(null);
      setCustomerLoadError("");
      return;
    }
    setCustomerLoadError("");
    let cancelled = false;
    getCustomer(code)
      .then((data) => { if (!cancelled) setCustomerDetails(data); })
      .catch(() => {
        if (!cancelled) {
          setCustomerDetails(null);
          setCustomerLoadError("Customer not found");
        }
      });
    return () => { cancelled = true; };
  }, [customerCode]);

  const handleCustomerCodeBlur = () => {
    const code = String(customerCode || "").trim();
    if (!code) return;
    getCustomer(code)
      .then((data) => setCustomerDetails(data))
      .catch(() => {
        setCustomerDetails(null);
        setCustomerLoadError("Customer not found");
      });
  };

  React.useEffect(() => {
    if (initialData) {
      setInvoiceNo(initialData.invoice_no);
      setCustomerCode(initialData.customer_code || "");
      setSalesPersonCode(initialData.sales_person_code || "");
      setSalesPersonName(initialData.sales_person_name || "");
      const d = initialData.invoice_date ? new Date(initialData.invoice_date).toISOString().slice(0, 10) : "";
      setInvoiceDate(d);
      setVatPercent(Number(initialData.vat_rate || 0.07) * 100);   // vat_rate from DB is decimal → multiply by 100
      const mappedItems = (initialData.line_items || []).map(li => ({
        line_item_id: li.id,
        product_code: li.product_code || "",
        product_label: li.product_label || `${li.product_code || ""} - ${li.product_name || ""}`.replace(/^ - /, ""),
        units_code: li.units_code || "",
        quantity: li.quantity,
        unit_price: Number(li.unit_price),
        line_discount_percent: Number(li.line_discount_percent || 0)
      }));
      setItems(mappedItems.length > 0 ? mappedItems : [{ product_code: "", quantity: 1, unit_price: 0 }]);
    } else {
      getConfig("vat_percent")
        .then((val) => { if (val !== null) setVatPercent(Number(val)); })
        .catch(() => {});   // keep default 7 on error
    }
  }, [initialData]);

  const vatRate = vatPercent / 100;   // convert percent to decimal for calculation

  const totalExtended = items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unit_price || 0), 0);
  const totalDiscount = items.reduce((s, it) => {
    const ext = Number(it.quantity || 0) * Number(it.unit_price || 0);
    const pct = Number(it.line_discount_percent || 0);
    return s + Math.round(ext * pct / 100 * 100) / 100;   // rounded to 2dp
  }, 0);
  const netPrice  = Math.round((totalExtended - totalDiscount) * 100) / 100;
  const vatAmount = Math.round(netPrice * vatRate * 100) / 100;
  const amountDue = netPrice + vatAmount;
  const [autoCode, setAutoCode] = React.useState(true);

  const hasEmptyProduct = items.some(it => !it.product_code);
  const hasEmptyCustomer = !String(customerCode || "").trim() || !customerDetails;

  const customerAddressDisplay = customerDetails
    ? [customerDetails.address_line1, customerDetails.address_line2, customerDetails.country_name].filter(Boolean).join(", ") || ""
    : "";

  function validate() {
    const errs = [];
    if (!invoiceDate) errs.push("Date should not be null");
    if (!String(customerCode).trim() || !customerDetails) errs.push("Customer must be selected");
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    if (errors.length > 0) {
      setAlertModal({ isOpen: true, title: "Save Failed.", message: <ul>{errors.map((m, i) => <li key={i}>{m}</li>)}</ul> });
      return;
    }

    const payload = {
      invoice_no: initialData ? invoiceNo.trim() : (autoCode ? "" : invoiceNo.trim()),
      customer_code: String(customerCode).trim(),
      sales_person_code: String(salesPersonCode || "").trim() || undefined,
      invoice_date: invoiceDate,
      vat_rate: vatRate,   // send as decimal (e.g. 0.07)
      line_items: items.map((x) => ({
        id: x.line_item_id,
        product_code: String(x.product_code).trim(),
        quantity: Number(x.quantity),
        unit_price: Number(x.unit_price),
        line_discount_percent: Number(x.line_discount_percent || 0),
      })),
    };
    onSubmit(payload);
  }

  return (
    <>
      <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal(p => ({ ...p, isOpen: false }))} title={alertModal.title} message={alertModal.message} />
      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="invoice-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 16 }}>
          <div className="card">
            <h4>Invoice Details</h4>
            <div style={{ display: "grid", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Invoice No</label>
                <div className="flex gap-2">
                  <input className="form-control" disabled={autoCode && !initialData} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                  {!initialData && (
                    <div className="form-inline-option">
                      <input type="checkbox" checked={autoCode} onChange={e => setAutoCode(e.target.checked)} id="inv_auto" />
                      <label htmlFor="inv_auto">Auto</label>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Selection */}
              <div className="form-group">
                <label className="form-label">Customer Code <span className="required-marker">*</span></label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="form-control" value={customerCode} onChange={(e) => setCustomerCode(e.target.value)} onBlur={handleCustomerCodeBlur} style={{ flex: 1 }} />
                  <button type="button" className="btn btn-primary" onClick={() => setCustomerModalOpen(true)}>LoV</button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input className="form-control" disabled value={customerDetails?.name ?? ""} readOnly />
              </div>

              {/* Sales Person Selection */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Sales Person Code</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      className="form-control"
                      value={salesPersonCode}
                      onChange={(e) => {
                        setSalesPersonCode(e.target.value);
                        setSalesPersonName("");
                      }}
                      placeholder="e.g. SP001"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => setSalesPersonModalOpen(true)}>LoV</button>
                    {salesPersonCode && (
                      <button type="button" onClick={() => { setSalesPersonCode(""); setSalesPersonName(""); }} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}>×</button>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Sales Person Name</label>
                  <input className="form-control" disabled value={salesPersonName} placeholder="—" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Invoice Date *</label>
                  <input type="date" className="form-control" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">VAT Rate (%)</label>
                  <input type="number" step="1" min="0" max="100" className="form-control" value={vatPercent} onChange={(e) => setVatPercent(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h4>Summary</h4>
            <div style={{ display: "grid", gap: 8 }}>
              <div className="flex justify-between"><span>Total Price</span><span>{formatBaht(totalExtended)}</span></div>
              <div className="flex justify-between text-error"><span>Total Discount</span><span>- {formatBaht(totalDiscount)}</span></div>
              <div className="flex justify-between font-bold text-primary"><span>Net Price</span><span>{formatBaht(netPrice)}</span></div>
              <div className="flex justify-between text-muted"><span>VAT ({vatPercent}%)</span><span>{formatBaht(vatAmount)}</span></div>
              <div className="flex justify-between font-bold" style={{ fontSize: '1.1rem', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}><span>Amount Due</span><span>{formatBaht(amountDue)}</span></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} disabled={submitting || hasEmptyProduct || hasEmptyCustomer}>
              {submitting ? "Processing..." : (initialData ? "Save Changes" : "Create Invoice")}
            </button>
          </div>
        </div>
        <LineItemsEditor value={items} onChange={setItems} />
      </form>

      <CustomerPickerModal isOpen={customerModalOpen} onClose={() => setCustomerModalOpen(false)} initialSearch={customerCode} onSelect={(code) => setCustomerCode(String(code))} />
      
      <SalesPersonPickerModal 
        isOpen={salesPersonModalOpen} 
        onClose={() => setSalesPersonModalOpen(false)} 
        onSelect={(code, name) => {
          setSalesPersonCode(code);
          setSalesPersonName(name);
          setSalesPersonModalOpen(false);
        }} 
      />
    </>
  );
}
