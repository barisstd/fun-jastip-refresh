import { describe, expect, it } from "vitest";
import { createInvoicePdf } from "@/jastip/lib/downloadInvoice";
import type { OrderDetail } from "@/jastip/types/order";

const order: OrderDetail = {
  orderId: "PDF-TEST", orderDate: "2026-11-27T00:00:00Z", customerName: "Pelanggan Uji",
  phoneLast4: "1992", shippingMethod: "CO Shopee", orderStatus: "Diproses",
  subtotalBeforeDiscount: 150000, discountTotal: 10000, total: 140000, paid: 40000,
  remaining: 100000, paymentStatus: "SUDAH DP",
  items: [{ productName: "Buku anak", price: 75000, discountPrice: 70000, qty: 2, subtotal: 140000 }],
  payments: [],
};

describe("Invoice PDF", () => {
  it("produces a real PDF instead of a PNG image", () => {
    const pdf = createInvoicePdf(order);
    expect(pdf.output().startsWith("%PDF-")).toBe(true);
    expect(pdf.output("blob").type).toBe("application/pdf");
    expect(pdf.getNumberOfPages()).toBe(1);
  });

  it("paginates long invoices instead of clipping product rows", () => {
    const pdf = createInvoicePdf({ ...order, items: Array.from({ length: 80 }, (_, i) => ({
      productName: `Buku ${i + 1} dengan nama produk panjang yang perlu beberapa baris dalam tabel invoice`,
      price: 75000, qty: 2, subtotal: 150000,
    })) });
    expect(pdf.getNumberOfPages()).toBeGreaterThan(3);
  });
});