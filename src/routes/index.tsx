import { createFileRoute } from "@tanstack/react-router";
import App from "@/jastip/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cek Pesanan — Jastip Ijun" },
      { name: "description", content: "Cek detail pesanan, pembayaran, dan sisa tagihan Jastip Ijun cukup dengan 4 digit terakhir nomor HP." },
      { property: "og:title", content: "Cek Pesanan — Jastip Ijun" },
      { property: "og:description", content: "Lacak pesanan dan pembayaran Jastip Ijun dengan mudah." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
