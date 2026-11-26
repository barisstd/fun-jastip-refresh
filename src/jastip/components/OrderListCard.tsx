import { PaymentStatusBadge } from "@/jastip/components/PaymentStatusBadge";
import { formatOrderDate, formatRupiah } from "@/jastip/lib/format";
import type { OrderSummary } from "@/jastip/types/order";

interface OrderListCardProps {
  order: OrderSummary;
  onSelect: (orderId: string) => void;
}

export function OrderListCard({ order, onSelect }: OrderListCardProps) {
  return (
    <button
      onClick={() => onSelect(order.orderId)}
      className="w-full rounded-card border-2 border-line bg-card p-5 text-left shadow-soft transition-all duration-150 hover:-translate-y-0.5 hover:border-cloth/50 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{order.orderId}</p>
          <p className="mt-0.5 text-sm text-ink/60">{formatOrderDate(order.orderDate)}</p>
        </div>
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
        <span className="text-sm text-ink/60">{order.orderStatus}</span>
        <span className="font-display text-xl font-semibold text-marigold-dark">
          {formatRupiah(order.total)}
        </span>
      </div>
    </button>
  );
}
