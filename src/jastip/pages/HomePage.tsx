import { useState } from "react";
import mascot from "@/assets/mascot.png";
import { PhoneDigitInput } from "@/jastip/components/PhoneDigitInput";
import { Button } from "@/jastip/components/Button";

interface HomePageProps {
  onSubmit: (last4: string) => void;
  initialValue?: string;
}

const PERKS = [
  { icon: "📦", label: "Status", tone: "bg-marigold-light" },
  { icon: "💸", label: "Tagihan", tone: "bg-cloth-light" },
  { icon: "🧾", label: "Invoice", tone: "bg-bubblegum/20" },
];

export function HomePage({ onSubmit, initialValue = "" }: HomePageProps) {
  const [digits, setDigits] = useState(initialValue);
  const isComplete = /^\d{4}$/.test(digits);

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative mx-auto mt-1">
        <div className="absolute inset-x-6 bottom-2 h-6 rounded-full bg-ink/10 blur-md" />
        <img src={mascot} alt="Maskot Jastip Ijun mengantar buku" width={1024} height={1024} className="relative h-48 w-48 animate-float" />
      </div>

      <div className="text-center">
        <h1 className="font-display text-[30px] font-semibold leading-tight text-ink">
          Hai! Mau cek <span className="text-marigold">pesanan</span>?
        </h1>
        <p className="mx-auto mt-2 max-w-[290px] text-[15px] leading-relaxed text-ink/60">
          Lihat status, pembayaran, dan sisa tagihanmu dalam sekejap.
        </p>
      </div>

      <form
        className="mt-7 rounded-card border-2 border-line bg-card p-6 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          if (isComplete) onSubmit(digits);
        }}
      >
        <label className="mb-4 block text-center font-display text-sm font-semibold uppercase tracking-wider text-cloth-dark">
          4 digit terakhir nomor HP
        </label>
        <PhoneDigitInput value={digits} onChange={setDigits} />
        <Button type="submit" fullWidth disabled={!isComplete} className="mt-7">
          Cek Pesanan 🚀
        </Button>
      </form>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {PERKS.map((p) => (
          <div key={p.label} className={`flex flex-col items-center gap-1 rounded-3xl ${p.tone} py-3`}>
            <span className="text-2xl">{p.icon}</span>
            <span className="font-display text-xs font-semibold text-ink/70">{p.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-auto pt-8 text-center text-xs leading-relaxed text-ink/45">
        🔒 Kami hanya memakai 4 digit terakhir nomor HP kamu — bukan nomor lengkap.
      </p>
    </div>
  );
}
