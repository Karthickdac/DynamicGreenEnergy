import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { type QuotationWithItems } from "@shared/schema";
import { Printer, Pencil, ChevronLeft, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function calcAmount(qty: number, rate: number, disc: number) {
  return qty * rate * (1 - disc / 100);
}
function calcGST(qty: number, rate: number, disc: number, gst: number) {
  return calcAmount(qty, rate, disc) * (gst / 100);
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  draft:    { bg: "#F3F4F6", text: "#374151", label: "Draft" },
  sent:     { bg: "#EFF6FF", text: "#1D4ED8", label: "Sent" },
  approved: { bg: "#F0FDF4", text: "#15803D", label: "Approved" },
  rejected: { bg: "#FEF2F2", text: "#B91C1C", label: "Rejected" },
};

export default function QuotationDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const { data: quotation, isLoading } = useQuery<QuotationWithItems>({
    queryKey: [`/api/quotations/${params.id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400">
        Loading quotation…
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Quotation not found.</p>
        <Button variant="outline" onClick={() => navigate("/quotations")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quotations
        </Button>
      </div>
    );
  }

  const subtotal = quotation.items.reduce((s, it) => s + calcAmount(it.qty, it.rate, it.discountPercent), 0);
  const totalGST = quotation.items.reduce((s, it) => s + calcGST(it.qty, it.rate, it.discountPercent, it.gstPercent), 0);
  const totalDiscount = quotation.items.reduce((s, it) => s + it.qty * it.rate * (it.discountPercent / 100), 0);
  const grandTotal = subtotal + totalGST;

  const statusStyle = STATUS_STYLE[quotation.status] || STATUS_STYLE.draft;

  return (
    <div className="min-h-screen bg-[#e8edf2] print:bg-white">

      {/* Toolbar — hidden on print */}
      <div className="no-print bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-500 gap-1" onClick={() => navigate("/quotations")}>
            <ChevronLeft className="w-4 h-4" /> All Quotations
          </Button>
          <div className="h-5 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-700 font-mono">{quotation.number}</span>
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize"
            style={{ background: statusStyle.bg, color: statusStyle.text }}
          >
            {statusStyle.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-gray-600"
            onClick={() => navigate(`/quotations/${params.id}/edit`)}
            data-testid="button-edit"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => window.print()}
            data-testid="button-print"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* Document */}
      <div className="py-8 px-4 print:py-0 print:px-0">
        <div
          className="bg-white mx-auto shadow-lg print:shadow-none"
          style={{ width: "210mm", minHeight: "297mm", boxSizing: "border-box", padding: "18mm 18mm 14mm 18mm" }}
          id="quotation-document"
        >
          {/* ── Header ── */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "6mm", gap: "6mm" }}>
            <img
              src="/images/logo.png"
              alt="Dynamic Green Energy"
              style={{ width: "22mm", height: "22mm", objectFit: "contain", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16pt", fontWeight: 700, color: "#1a3c2e", lineHeight: 1.2, fontFamily: "Poppins, sans-serif" }}>
                M/s. Dynamic Green Energy
              </div>
              <div style={{ fontSize: "8pt", color: "#16a34a", fontStyle: "italic", marginBottom: "3mm", fontFamily: "Poppins, sans-serif" }}>
                Reliable Solar Project Developers
              </div>
              <div style={{ fontSize: "7.5pt", color: "#374151", lineHeight: 1.7, fontFamily: "Poppins, sans-serif" }}>
                Flat No: 189, Thamirabarani Street, Park Town, Madurai – 625017, Tamil Nadu, India<br />
                Tel: +91 80728 24034 &nbsp;•&nbsp; dynamicmdu2018@gmail.com &nbsp;•&nbsp; www.dynamicgreenenergy.in<br />
                <strong>GSTIN:</strong> 33ATLPV5789M1ZK
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1.5px solid #1a3c2e", marginBottom: "5mm" }} />

          {/* ── Quotation Meta ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5mm" }}>
            <div>
              <div style={{ fontSize: "13pt", fontWeight: 700, color: "#111827", fontFamily: "Poppins, sans-serif" }}>
                Quotation {quotation.number}
              </div>
              <div style={{ fontSize: "8.5pt", color: "#4B5563", marginTop: "1.5mm", fontFamily: "Poppins, sans-serif" }}>
                {quotation.type}
              </div>
            </div>
            <div
              style={{
                fontSize: "7.5pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                padding: "2mm 4mm",
                borderRadius: "3mm",
                background: statusStyle.bg,
                color: statusStyle.text,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {statusStyle.label}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2mm 8mm", marginBottom: "6mm", fontSize: "8.5pt", fontFamily: "Poppins, sans-serif" }}>
            <div>
              <span style={{ color: "#6B7280", fontWeight: 600 }}>Customer: </span>
              <span style={{ color: "#111827", fontWeight: 600 }}>{quotation.customerName}</span>
            </div>
            <div>
              <span style={{ color: "#6B7280", fontWeight: 600 }}>Created: </span>
              <span style={{ color: "#111827" }}>{formatDate(quotation.createdDate)}</span>
            </div>
            <div>
              <span style={{ color: "#6B7280", fontWeight: 600 }}>Valid Until: </span>
              <span style={{ color: "#111827" }}>{formatDate(quotation.validUntil)}</span>
            </div>
          </div>

          {/* ── Items Table ── */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", fontFamily: "Poppins, sans-serif", marginBottom: "5mm" }}>
            <thead>
              <tr style={{ background: "#1a3c2e", color: "#ffffff" }}>
                {["#", "Item Description", "Qty", "Unit", "Rate (₹)", "Disc%", "GST%", "Amount (₹)"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "3mm 2.5mm",
                      textAlign: i === 0 ? "center" : i >= 4 ? "right" : "left",
                      fontWeight: 600,
                      fontSize: "7.5pt",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                      width: i === 0 ? "6mm" : i === 1 ? "auto" : undefined,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, idx) => {
                const amount = calcAmount(item.qty, item.rate, item.discountPercent);
                const isEven = idx % 2 === 0;
                return (
                  <tr key={item.id} style={{ background: isEven ? "#ffffff" : "#f9fafb" }}>
                    <td style={{ padding: "2.5mm 2.5mm", textAlign: "center", color: "#6B7280", borderBottom: "0.5px solid #E5E7EB" }}>{idx + 1}</td>
                    <td style={{ padding: "2.5mm 2.5mm", color: "#111827", fontWeight: 500, borderBottom: "0.5px solid #E5E7EB" }}>{item.itemName}</td>
                    <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#374151", borderBottom: "0.5px solid #E5E7EB" }}>{item.qty.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "2.5mm 2.5mm", textAlign: "left", color: "#374151", borderBottom: "0.5px solid #E5E7EB" }}>{item.unit}</td>
                    <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#374151", borderBottom: "0.5px solid #E5E7EB", fontVariantNumeric: "tabular-nums" }}>{formatINR(item.rate)}</td>
                    <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#374151", borderBottom: "0.5px solid #E5E7EB" }}>{item.discountPercent}</td>
                    <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#374151", borderBottom: "0.5px solid #E5E7EB" }}>{item.gstPercent}</td>
                    <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#111827", fontWeight: 600, borderBottom: "0.5px solid #E5E7EB", fontVariantNumeric: "tabular-nums" }}>{formatINR(amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ── Totals ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6mm" }}>
            <div style={{ width: "64mm", fontFamily: "Poppins, sans-serif", fontSize: "8.5pt" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5mm 0", color: "#4B5563", borderBottom: "0.5px solid #E5E7EB" }}>
                <span>Subtotal</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>₹{formatINR(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5mm 0", color: "#DC2626", borderBottom: "0.5px solid #E5E7EB" }}>
                  <span>Discount</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>−₹{formatINR(totalDiscount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5mm 0", color: "#4B5563", borderBottom: "0.5px solid #E5E7EB" }}>
                <span>GST</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>₹{formatINR(totalGST)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "2.5mm 3mm", background: "#1a3c2e", color: "#ffffff", borderRadius: "2mm", marginTop: "2mm", fontWeight: 700, fontSize: "9.5pt" }}>
                <span>Total</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>₹{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          {quotation.notes && (
            <div style={{ marginBottom: "6mm", padding: "3mm 4mm", background: "#F9FAFB", borderLeft: "3px solid #16a34a", borderRadius: "1mm", fontFamily: "Poppins, sans-serif" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1mm" }}>Notes / Terms</div>
              <div style={{ fontSize: "8pt", color: "#374151", whiteSpace: "pre-line" }}>{quotation.notes}</div>
            </div>
          )}

          {/* ── Footer ── */}
          <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "4mm", display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontFamily: "Poppins, sans-serif" }}>
            <div style={{ fontSize: "7pt", color: "#9CA3AF" }}>
              <div>This is a computer-generated quotation.</div>
              <div>For queries, contact: +91 80728 24034 &nbsp;|&nbsp; dynamicmdu2018@gmail.com</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ height: "10mm", borderBottom: "1px solid #374151", width: "40mm", marginBottom: "1mm" }} />
              <div style={{ fontSize: "7pt", color: "#6B7280" }}>Authorised Signatory</div>
              <div style={{ fontSize: "7.5pt", fontWeight: 600, color: "#1a3c2e" }}>Dynamic Green Energy</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white !important; }
          @page { size: A4 portrait; margin: 0; }
          #quotation-document { box-shadow: none !important; width: 100% !important; min-height: unset !important; }
        }
      `}</style>
    </div>
  );
}
