import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/jastip/services/orders.functions", () => ({ requestOrders: vi.fn() }));
import { requestOrders } from "@/jastip/services/orders.functions";
import { CloudOrdersApi } from "@/jastip/services/CloudOrdersApi";

describe("Cloud order connection", () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); });

  it("uses the Cloud connection without VITE settings or mock fallback", async () => {
    vi.mocked(requestOrders).mockResolvedValue({ ok: true, orders: [] });
    const api = new CloudOrdersApi();
    await expect(api.lookupByPhoneLast4("1992")).resolves.toEqual([]);
    expect(requestOrders).toHaveBeenCalledWith({ data: {
      action: "lookup", phoneLast4: "1992", clientId: expect.any(String),
    } });
  });

  it("passes the same phone digits and device id for detail verification", async () => {
    vi.mocked(requestOrders).mockResolvedValue({ ok: false, error: "NOT_FOUND" });
    const api = new CloudOrdersApi();
    await expect(api.lookupByPhoneLast4("1992")).rejects.toMatchObject({ code: "NOT_FOUND" });
    const clientId = localStorage.getItem("ijun_client_id");
    await expect(api.getOrderDetail("OOTB-1992", "1992")).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(requestOrders).toHaveBeenLastCalledWith({ data: {
      action: "detail", orderId: "OOTB-1992", phoneLast4: "1992", clientId,
    } });
  });

  it("surfaces connection errors instead of returning sample data", async () => {
    vi.mocked(requestOrders).mockRejectedValue(new Error("Connection failed"));
    await expect(new CloudOrdersApi().lookupByPhoneLast4("1992")).rejects.toMatchObject({ code: "SERVER_ERROR" });
  });
});