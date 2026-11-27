import { useEffect, useState } from "react";
import { ScreenHeader } from "@/jastip/components/ScreenHeader";
import { PaymentStatusBadge } from "@/jastip/components/PaymentStatusBadge";
import { ProductRow } from "@/jastip/components/ProductRow";
import { PaymentSummaryCard } from "@/jastip/components/PaymentSummaryCard";
import { PaymentAccountsPanel } from "@/jastip/components/PaymentAccountsPanel";
import { Button } from "@/jastip/components/Button";
import { formatOrderDate } from "@/jastip/lib/format";
import type { OrderDetail } from "@/jastip/types/order";

interface OrderDetailPageProps {
  order: OrderDetail;
  onBack: () => void;
  showBack: boolean;
}

const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "6281234567890";

export function OrderDetailPage({ order, onBack, showBack }: OrderDetailPageProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [preparedInvoice, setPreparedInvoice] = useState<{ order: OrderDetail; blob: Blob; deliver: (blob: Blob, filename: string) => Promise<void> } | null>(null);
  const [prepareAttempt, setPrepareAttempt] = useState(0);
  const isUnpaid = order.paymentStatus !== "LUNAS";

  useEffect(() => {
    let cancelled = false;
    setDownloadError(false);
    void import("@/jastip/lib/downloadInvoice").then(({ createInvoicePdf, deliverInvoicePdf }) => {
      const blob = createInvoicePdf(order).output("blob");
      if (!cancelled) setPreparedInvoice({ order, blob, deliver: deliverInvoicePdf });
    }).catch(() => { if (!cancelled) setDownloadError(true); });
    return () => { cancelled = true; };
  }, [order, prepareAttempt]);

  const waMessage = encodeURIComponent(
    `Halo Admin Ijun Bookstore, saya mau tanya soal pesanan ${order.orderId} (${order.customerName}).`
  );
  const waHref = `https://wa.me/${ADMIN_WHATSAPP}?text=${waMessage}`;

  async function handleDownload() {
    if (downloading) return;
    if (!preparedInvoice || preparedInvoice.order !== order) {
      setPrepareAttempt((attempt) => attempt + 1);
      return;
    }
    setDownloading(true);
    setDownloadError(false);
    try {
      const safeId = order.orderId.replace(/[^a-zA-Z0-9_-]/g, "_");
      await preparedInvoice.deliver(preparedInvoice.blob, `invoice-${safeId}.pdf`);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {showBack ? (
        <ScreenHeader title="Detail Pesanan" onBack={onBack} backLabel="Daftar pesanan" />
      ) : (
        <ScreenHeader title="Detail Pesanan" onBack={onBack} backLabel="Cari nomor lain" />
      )}

      <div className="flex flex-col gap-5">
        {/* Order identity */}
        <div className="rounded-card border-2 border-line bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl font-semibold text-ink">
                {order.orderId}
              </p>
              <p className="mt-0.5 text-sm text-ink/60">
                {formatOrderDate(order.orderDate)}
              </p>
            </div>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
          <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/50">Nama</span>
              <span className="font-medium text-ink">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Pengiriman</span>
              <span className="font-medium text-ink">{order.shippingMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Status Pesanan</span>
              <span className="font-medium text-ink">{order.orderStatus}</span>
            </div>
          </div>
        </div>

        {/* Product list */}
        <div className="rounded-card border-2 border-line bg-card p-5 shadow-soft">
          <p className="mb-1 text-sm font-medium text-ink/70">Produk</p>
          <div className="divide-y divide-line">
            {order.items.map((item, i) => (
              <ProductRow key={`${item.productName}-${i}`} item={item} />
            ))}
          </div>
        </div>

        {/* Payment summary */}
        <PaymentSummaryCard
          subtotalBeforeDiscount={order.subtotalBeforeDiscount}
          discountTotal={order.discountTotal}
          total={order.total}
          paid={order.paid}
          remaining={order.remaining}
          status={order.paymentStatus}
        />

        {/* Bayar Sekarang — only shown while there's a balance owing */}
        {isUnpaid && (
          <div className="flex flex-col gap-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() => setShowPayment((s) => !s)}
            >
              {showPayment ? "Sembunyikan Info Transfer" : "Bayar Sekarang"}
            </Button>
            {showPayment && <PaymentAccountsPanel />}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 pb-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => window.open(waHref, "_blank", "noopener,noreferrer")}
          >
            Hubungi Admin
          </Button>
          <Button variant="outline" fullWidth loading={downloading || (!downloadError && preparedInvoice?.order !== order)} onClick={handleDownload}>
            Download Invoice PDF
          </Button>
          {downloadError && (
            <p className="text-center text-sm text-brick">
              Gagal membuat PDF invoice. Coba lagi ya.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
