import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatOrderDate, formatRupiah } from "@/jastip/lib/format";
import { PAYMENT_ACCOUNTS, PAYMENT_ACCOUNT_HOLDER } from "@/jastip/lib/paymentAccounts";
import type { OrderDetail } from "@/jastip/types/order";

// Print-specific palette: independent from browser CSS and screen dimensions.
const PRINT = { ink: "#263632", muted: "#64716D", accent: "#119C90", line: "#DEE5E2", light: "#F3F7F5" };
const money = (amount: number) => formatRupiah(amount).replace(/\u00a0/g, " ");

export function createInvoicePdf(order: OrderDetail): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({ title: `Invoice ${order.orderId} - Jastip Ijun`, author: "Jastip Ijun" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PRINT.accent);
  doc.setFontSize(22);
  doc.text("JASTIP IJUN", 16, 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(PRINT.muted);
  doc.text("Baby & Kids Bookshop", 16, 29);
  doc.setFontSize(12);
  doc.text("INVOICE", 194, 22, { align: "right" });

  let nextY = 38;
  function table(head: string[][], body: string[][], widths?: Record<number, { cellWidth: number; halign?: "right" }>) {
    autoTable(doc, {
      startY: nextY,
      margin: { top: 16, right: 16, bottom: 23, left: 16 },
      head, body, theme: "grid", rowPageBreak: "avoid",
      styles: { font: "helvetica", fontSize: 10, cellPadding: 3, textColor: PRINT.ink, lineColor: PRINT.line, lineWidth: 0.2, overflow: "linebreak" },
      headStyles: { fillColor: PRINT.accent, textColor: "#FFFFFF", fontStyle: "bold" },
      alternateRowStyles: { fillColor: PRINT.light },
      ...(widths ? { columnStyles: widths } : {}),
    });
    const last = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable;
    nextY = (last?.finalY ?? nextY) + 8;
  }

  table([], [
    ["Nomor pesanan", order.orderId],
    ["Tanggal", formatOrderDate(order.orderDate)],
    ["Nama", order.customerName],
    ["Pengiriman", order.shippingMethod],
    ["Status pesanan", order.orderStatus],
    ["Status pembayaran", order.paymentStatus],
  ], { 0: { cellWidth: 48 }, 1: { cellWidth: 130 } });

  table([["Produk", "Harga satuan", "Qty", "Subtotal"]], order.items.map((item) => [
    item.productName,
    item.discountPrice !== undefined ? `${money(item.discountPrice)}\nHarga awal: ${money(item.price)}` : money(item.price),
    String(item.qty), money(item.subtotal),
  ]), { 0: { cellWidth: 78 }, 1: { cellWidth: 43, halign: "right" }, 2: { cellWidth: 14, halign: "right" }, 3: { cellWidth: 43, halign: "right" } });

  table([], [
    ["Subtotal sebelum diskon", money(order.subtotalBeforeDiscount)],
    ["Diskon", money(order.discountTotal)],
    ["Total pesanan", money(order.total)],
    ["Sudah dibayar", money(order.paid)],
    ["Sisa tagihan", money(order.remaining)],
  ], { 0: { cellWidth: 110 }, 1: { cellWidth: 68, halign: "right" } });

  if (order.payments.length) {
    table([["Tanggal pembayaran", "Metode", "Status", "Jumlah"]], order.payments.map((payment) => [
      formatOrderDate(payment.paymentDate), payment.method, payment.status, money(payment.amount),
    ]));
  }
  if (order.paymentStatus !== "LUNAS") {
    table([["Rekening pembayaran", `a.n. ${PAYMENT_ACCOUNT_HOLDER}`]], PAYMENT_ACCOUNTS.map((account) => [account.bank, account.accountNumber]));
  }
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(PRINT.muted);
    doc.setFontSize(9);
    doc.text("Terimakasih sudah berbelanja di Jastip Ijun", 16, 284);
    doc.text(`${page} / ${pages}`, 194, 284, { align: "right" });
  }
  return doc;
}

/** Called synchronously from the download button after the PDF is prepared. */
export async function deliverInvoicePdf(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: "application/pdf" });
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
