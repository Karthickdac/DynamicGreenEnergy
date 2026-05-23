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
  draft:    { bg: "#F3F4F6", text: "#374151", label: "DRAFT" },
  sent:     { bg: "#DBEAFE", text: "#1D4ED8", label: "SENT" },
  approved: { bg: "#DCFCE7", text: "#15803D", label: "APPROVED" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C", label: "REJECTED" },
};

export default function QuotationDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const { data: quotation, isLoading } = useQuery<QuotationWithItems>({
    queryKey: [`/api/quotations/${params.id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        Loading quotation…
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-sm">Quotation not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/quotations")}>
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
    <>
      {/* ─── Global print styles injected into <head> ─── */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          @page { size: A4 portrait; margin: 12mm 14mm 12mm 14mm; }
          .no-print { display: none !important; }
          .print-page { background: white !important; padding: 0 !important; margin: 0 !important; }
          #quotation-doc { width: 100% !important; box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#E8EDF2] print-page">

        {/* ── Toolbar (hidden on print) ── */}
        <div className="no-print bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-gray-500 gap-1 hover:text-gray-800" onClick={() => navigate("/quotations")}>
              <ChevronLeft className="w-4 h-4" /> All Quotations
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            <span className="text-sm font-semibold text-gray-700 font-mono tracking-wide">{quotation.number}</span>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: statusStyle.bg, color: statusStyle.text }}
            >
              {statusStyle.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900"
              onClick={() => navigate(`/quotations/${params.id}/edit`)} data-testid="button-edit">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
            <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.print()} data-testid="button-print">
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </Button>
          </div>
        </div>

        {/* ── A4 Document ── */}
        <div className="py-8 px-4 print:py-0 print:px-0">
          <div
            id="quotation-doc"
            style={{
              background: "#ffffff",
              width: "210mm",
              minHeight: "297mm",
              margin: "0 auto",
              padding: "16mm 18mm 14mm 18mm",
              boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
              boxSizing: "border-box",
              fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
              fontSize: "9pt",
              color: "#1F2937",
            }}
          >

            {/* ── Company Header ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "5mm" }}>
              <tbody>
                <tr>
                  <td style={{ width: "24mm", verticalAlign: "top", paddingRight: "5mm" }}>
                    <img
                      src="/images/dge-logo.jpg"
                      alt="Dynamic Green Energy"
                      style={{ width: "22mm", height: "22mm", objectFit: "contain", borderRadius: "3mm" }}
                    />
                  </td>
                  <td style={{ verticalAlign: "top" }}>
                    <div style={{ fontSize: "16pt", fontWeight: 800, color: "#14532D", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                      M/s. Dynamic Green Energy
                    </div>
                    <div style={{ fontSize: "8pt", color: "#16A34A", fontStyle: "italic", marginBottom: "2.5mm", fontWeight: 500 }}>
                      Reliable Solar Project Developers
                    </div>
                    <div style={{ fontSize: "7.5pt", color: "#4B5563", lineHeight: 1.8 }}>
                      Flat No: 189, Thamirabarani Street, Park Town, Madurai – 625017, Tamil Nadu, India<br />
                      Tel: +91 80728 24034 &nbsp;·&nbsp; dynamicmdu2018@gmail.com &nbsp;·&nbsp; www.dynamicgreenenergy.in<br />
                      <span style={{ fontWeight: 700, color: "#374151" }}>GSTIN:</span> 33ATLPV5789M1ZK
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── Horizontal Rule ── */}
            <div style={{ borderTop: "2px solid #14532D", marginBottom: "5mm" }} />

            {/* ── Quotation Title + Status ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "4mm" }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <div style={{ fontSize: "13.5pt", fontWeight: 800, color: "#111827", letterSpacing: "-0.01em" }}>
                      Quotation {quotation.number}
                    </div>
                    <div style={{ fontSize: "8pt", color: "#6B7280", marginTop: "0.8mm", fontWeight: 500 }}>
                      {quotation.type}
                    </div>
                  </td>
                  <td style={{ verticalAlign: "top", textAlign: "right" }}>
                    <span style={{
                      display: "inline-block",
                      fontSize: "7pt",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      padding: "1.5mm 4mm",
                      borderRadius: "20mm",
                      background: statusStyle.bg,
                      color: statusStyle.text,
                    }}>
                      {statusStyle.label}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── Meta Info ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "6mm", fontSize: "8.5pt" }}>
              <tbody>
                <tr>
                  <td style={{ paddingBottom: "1.5mm", width: "50%" }}>
                    <span style={{ color: "#6B7280", fontWeight: 600 }}>Customer: </span>
                    <span style={{ color: "#111827", fontWeight: 700 }}>{quotation.customerName}</span>
                  </td>
                  <td style={{ paddingBottom: "1.5mm" }}>
                    <span style={{ color: "#6B7280", fontWeight: 600 }}>Created: </span>
                    <span style={{ color: "#374151" }}>{formatDate(quotation.createdDate)}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style={{ color: "#6B7280", fontWeight: 600 }}>Valid Until: </span>
                    <span style={{ color: "#374151" }}>{formatDate(quotation.validUntil)}</span>
                  </td>
                  <td>
                    <span style={{ color: "#6B7280", fontWeight: 600 }}>Ref: </span>
                    <span style={{ color: "#374151", fontFamily: "monospace", fontSize: "8pt" }}>{quotation.number}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── Items Table ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "4mm", fontSize: "8pt" }}>
              <thead>
                <tr style={{ background: "#14532D" }}>
                  {[
                    { label: "#",            align: "center", w: "6mm"  },
                    { label: "Item Description", align: "left",   w: "auto" },
                    { label: "Qty",          align: "right",  w: "12mm" },
                    { label: "Unit",         align: "left",   w: "14mm" },
                    { label: "Rate (₹)",     align: "right",  w: "24mm" },
                    { label: "Disc%",        align: "right",  w: "14mm" },
                    { label: "GST%",         align: "right",  w: "12mm" },
                    { label: "Amount (₹)",   align: "right",  w: "28mm" },
                  ].map((col) => (
                    <th key={col.label} style={{
                      padding: "3mm 2.5mm",
                      textAlign: col.align as "center" | "left" | "right",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "7.5pt",
                      letterSpacing: "0.02em",
                      width: col.w,
                      whiteSpace: "nowrap",
                    }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, idx) => {
                  const amount = calcAmount(item.qty, item.rate, item.discountPercent);
                  return (
                    <tr key={item.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#F9FAFB" }}>
                      <td style={{ padding: "2.5mm 2.5mm", textAlign: "center", color: "#9CA3AF", borderBottom: "0.5px solid #E5E7EB", fontSize: "7.5pt" }}>{idx + 1}</td>
                      <td style={{ padding: "2.5mm 2.5mm", color: "#111827", fontWeight: 600, borderBottom: "0.5px solid #E5E7EB" }}>{item.itemName}</td>
                      <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#374151", borderBottom: "0.5px solid #E5E7EB" }}>{item.qty.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "2.5mm 2.5mm", textAlign: "left",  color: "#6B7280", borderBottom: "0.5px solid #E5E7EB" }}>{item.unit}</td>
                      <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#374151", borderBottom: "0.5px solid #E5E7EB", fontVariantNumeric: "tabular-nums" }}>{formatINR(item.rate)}</td>
                      <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#374151", borderBottom: "0.5px solid #E5E7EB" }}>{item.discountPercent}%</td>
                      <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#374151", borderBottom: "0.5px solid #E5E7EB" }}>{item.gstPercent}%</td>
                      <td style={{ padding: "2.5mm 2.5mm", textAlign: "right", color: "#111827", fontWeight: 700, borderBottom: "0.5px solid #E5E7EB", fontVariantNumeric: "tabular-nums" }}>{formatINR(amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ── Totals ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "6mm" }}>
              <tbody>
                <tr>
                  <td style={{ width: "60%" }} />
                  <td style={{ width: "40%" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8.5pt" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: "1.8mm 3mm", color: "#6B7280", borderBottom: "0.5px solid #E5E7EB" }}>Subtotal</td>
                          <td style={{ padding: "1.8mm 3mm", textAlign: "right", color: "#111827", fontWeight: 600, borderBottom: "0.5px solid #E5E7EB", fontVariantNumeric: "tabular-nums" }}>₹{formatINR(subtotal)}</td>
                        </tr>
                        {totalDiscount > 0 && (
                          <tr>
                            <td style={{ padding: "1.8mm 3mm", color: "#DC2626", borderBottom: "0.5px solid #E5E7EB" }}>Discount</td>
                            <td style={{ padding: "1.8mm 3mm", textAlign: "right", color: "#DC2626", fontWeight: 600, borderBottom: "0.5px solid #E5E7EB", fontVariantNumeric: "tabular-nums" }}>−₹{formatINR(totalDiscount)}</td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ padding: "1.8mm 3mm", color: "#6B7280", borderBottom: "0.5px solid #E5E7EB" }}>GST</td>
                          <td style={{ padding: "1.8mm 3mm", textAlign: "right", color: "#111827", fontWeight: 600, borderBottom: "0.5px solid #E5E7EB", fontVariantNumeric: "tabular-nums" }}>₹{formatINR(totalGST)}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{ padding: "0.5mm" }} />
                        </tr>
                        <tr style={{ background: "#14532D" }}>
                          <td style={{ padding: "3mm 4mm", color: "#ffffff", fontWeight: 800, fontSize: "10pt", borderRadius: "0" }}>Total</td>
                          <td style={{ padding: "3mm 4mm", textAlign: "right", color: "#ffffff", fontWeight: 800, fontSize: "10pt", fontVariantNumeric: "tabular-nums" }}>₹{formatINR(grandTotal)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── Notes / Terms ── */}
            {quotation.notes && (
              <div style={{
                marginBottom: "6mm",
                padding: "3mm 4mm",
                background: "#F0FDF4",
                borderLeft: "3px solid #16A34A",
                borderRadius: "1mm",
              }}>
                <div style={{ fontSize: "6.5pt", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1.5mm" }}>
                  Notes &amp; Terms
                </div>
                <div style={{ fontSize: "8pt", color: "#374151", whiteSpace: "pre-line", lineHeight: 1.7 }}>
                  {quotation.notes}
                </div>
              </div>
            )}

            {/* ── Footer ── */}
            <div style={{ borderTop: "1.5px solid #E5E7EB", paddingTop: "4mm", marginTop: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "7.5pt" }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: "bottom", color: "#9CA3AF", lineHeight: 1.7 }}>
                      <div>This is a computer-generated quotation and does not require a physical signature.</div>
                      <div>Contact: +91 80728 24034 &nbsp;·&nbsp; dynamicmdu2018@gmail.com</div>
                    </td>
                    <td style={{ verticalAlign: "bottom", textAlign: "right", width: "50mm" }}>
                      <div style={{ height: "12mm", borderBottom: "1px solid #9CA3AF", marginBottom: "1.5mm" }} />
                      <div style={{ color: "#6B7280", fontSize: "7pt" }}>Authorised Signatory</div>
                      <div style={{ color: "#14532D", fontWeight: 700, fontSize: "7.5pt" }}>M/s. Dynamic Green Energy</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>{/* end #quotation-doc */}
        </div>

      </div>
    </>
  );
}
