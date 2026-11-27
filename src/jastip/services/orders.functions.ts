import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { DetailResponse, LookupResponse } from "@/jastip/types/order";

const commonInput = {
  phoneLast4: z.string().regex(/^\d{4}$/),
  clientId: z.string().min(1).max(100).regex(/^[a-zA-Z0-9-]+$/),
};

export const ordersRequestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("lookup"), ...commonInput }),
  z.object({ action: z.literal("detail"), ...commonInput, orderId: z.string().min(1).max(200) }),
]);

export const requestOrders = createServerFn({ method: "POST" })
  .inputValidator((input: z.infer<typeof ordersRequestSchema>) => ordersRequestSchema.parse(input))
  .handler(async ({ data }): Promise<LookupResponse | DetailResponse> => {
    const baseUrl = process.env['APPS_SCRIPT_URL'];
    const clientToken = process.env['APPS_SCRIPT_CLIENT_TOKEN'];
    if (!baseUrl || !clientToken) {
      console.error("Order connection settings are missing.");
      return { ok: false, error: "SERVER_ERROR" };
    }

    // The destination is configured by the builder, never by the caller.
    const url = new URL(baseUrl);
    if (url.protocol !== "https:" || url.hostname !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) {
      return { ok: false, error: "SERVER_ERROR" };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ ...data, clientToken }),
        signal: AbortSignal.timeout(12_000),
        redirect: "follow",
      });
      if (!response.ok) return { ok: false, error: "SERVER_ERROR" };
      const result = await response.json() as LookupResponse | DetailResponse;
      if (result.ok === false) {
        const error = result.error;
        return { ok: false, error: error === "INVALID_INPUT" || error === "NOT_FOUND" || error === "RATE_LIMITED" ? error : "SERVER_ERROR" };
      }
      // Apps Script still verifies phoneLast4 for both lookup and detail,
      // and enforces its existing per-device rate limit.
      if (data.action === "lookup" && "orders" in result && Array.isArray(result.orders)) {
        return { ok: true, orders: result.orders };
      }
      if (data.action === "detail" && "order" in result && result.order) {
        return { ok: true, order: result.order };
      }
      return { ok: false, error: "SERVER_ERROR" };
    } catch {
      // Never log remote response bodies or credentials.
      return { ok: false, error: "SERVER_ERROR" };
    }
  });