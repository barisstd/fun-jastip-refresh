interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  backLabel?: string;
}

export function ScreenHeader({ title, onBack, backLabel = "Kembali" }: ScreenHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <button
        onClick={onBack}
        aria-label={backLabel}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-line bg-card text-ink shadow-pop-line transition-all active:translate-y-1 active:shadow-none"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M11 3.5L5 9L11 14.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
    </div>
  );
}
