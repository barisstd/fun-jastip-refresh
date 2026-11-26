const LETTERS = ["text-marigold", "text-cloth", "text-bubblegum", "text-leaf", "text-marigold-dark"];

export function BrandHeader({ large = false }: { large?: boolean }) {
  const word = "Jastip";
  return (
    <div className={`flex items-center ${large ? "justify-center" : "justify-between"}`}>
      <span className={`flex items-baseline font-display font-bold tracking-tight ${large ? "text-[34px]" : "text-[22px]"}`}>
        {word.split("").map((ch, i) => (
          <span key={i} className={`${LETTERS[i % LETTERS.length]} inline-block ${i % 2 ? "rotate-3" : "-rotate-3"}`}>
            {ch}
          </span>
        ))}
        <span className="ml-1.5 text-ink">Ijun</span>
      </span>
      {!large && (
        <span className="rounded-full bg-cloth-light px-3 py-1 text-xs font-bold text-cloth-dark">Cek Pesanan</span>
      )}
    </div>
  );
}
