import type { OrdersApi } from "@/jastip/services/OrdersApi";
import { ApiError } from "@/jastip/services/ApiError";
import { requestOrders } from "@/jastip/services/orders.functions";
import type { OrderDetail, OrderSummary } from "@/jastip/types/order";

export class CloudOrdersApi implements OrdersApi {
  private clientId: string | undefined;

  // Called only from lookup/detail events, not during SSR/module loading.
  private getClientId(): string {
    if (this.clientId) return this.clientId;
    try {
      const stored = localStorage.getItem("ijun_client_id");
      this.clientId = stored && /^[a-zA-Z0-9-]{1,100}$/.test(stored) ? stored : crypto.randomUUID();
      localStorage.setItem("ijun_client_id", this.clientId);
    } catch {
      this.clientId = crypto.randomUUID();
    }
    return this.clientId;
  }

  async lookupByPhoneLast4(last4: string): Promise<OrderSummary[]> {
    try {
      const result = await requestOrders({ data: { action: "lookup", phoneLast4: last4, clientId: this.getClientId() } });
      if (!result.ok) throw new ApiError(result.error ?? "SERVER_ERROR");
      if (!("orders" in result)) throw new ApiError("SERVER_ERROR");
      return result.orders;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("SERVER_ERROR");
    }
  }

  async getOrderDetail(orderId: string, last4: string): Promise<OrderDetail> {
    try {
      const result = await requestOrders({ data: { action: "detail", orderId, phoneLast4: last4, clientId: this.getClientId() } });
      if (!result.ok) throw new ApiError(result.error ?? "SERVER_ERROR");
      if (!("order" in result) || !result.order) throw new ApiError("SERVER_ERROR");
      return result.order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("SERVER_ERROR");
    }
  }
}