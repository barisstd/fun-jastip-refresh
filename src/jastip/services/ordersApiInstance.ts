import type { OrdersApi } from "@/jastip/services/OrdersApi";
import { CloudOrdersApi } from "@/jastip/services/CloudOrdersApi";

/**
 * Single wiring point for which backend the app talks to.
 * To point at a different backend later, add a new class that
 * implements OrdersApi and swap it in here — nothing else changes.
 */
export const ordersApi: OrdersApi = new CloudOrdersApi();
