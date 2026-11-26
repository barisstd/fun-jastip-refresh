import mascot from "@/assets/mascot.png";

export function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center" role="status">
      <img src={mascot} alt="" width={1024} height={1024} className="h-36 w-36 animate-float" />
      <div className="flex gap-1.5">
        {["bg-marigold", "bg-cloth", "bg-bubblegum"].map((c, i) => (
          <span key={c} className={`h-2.5 w-2.5 animate-bounce rounded-full ${c}`} style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="font-display text-base font-medium text-ink/70">{message}</p>
    </div>
  );
}
