import { cn } from "@/lib/utils";

export type Bandeira = "Mastercard" | "Visa" | "Elo" | "Amex";

/** Marca colorida da bandeira do cartão, em formato de mini cartão (proporção 3:2). */
export function BandeiraCartao({ bandeira, className }: { bandeira: string; className?: string }) {
  const base = cn("inline-flex h-5 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-border bg-white", className);

  if (bandeira === "Mastercard") {
    return (
      <span className={base} aria-label="Mastercard">
        <svg viewBox="0 0 32 20" className="h-full w-full">
          <circle cx="12.5" cy="10" r="6" fill="#EB001B" />
          <circle cx="19.5" cy="10" r="6" fill="#F79E1B" />
          <path d="M16 5.13a6 6 0 0 1 0 9.74 6 6 0 0 1 0-9.74Z" fill="#FF5F00" />
        </svg>
      </span>
    );
  }

  if (bandeira === "Visa") {
    return (
      <span className={base} aria-label="Visa">
        <svg viewBox="0 0 32 20" className="h-full w-full">
          <text x="16" y="13.6" textAnchor="middle" fontSize="9" fontWeight="800" fontStyle="italic" fill="#1A1F71" fontFamily="Arial, sans-serif">
            VISA
          </text>
        </svg>
      </span>
    );
  }

  if (bandeira === "Elo") {
    return (
      <span className={cn(base, "border-black bg-black")} aria-label="Elo">
        <svg viewBox="0 0 32 20" className="h-full w-full">
          <circle cx="9" cy="10" r="1.6" fill="#FFCB05" />
          <circle cx="12.5" cy="10" r="1.6" fill="#00A4E0" />
          <circle cx="16" cy="10" r="1.6" fill="#EF4123" />
          <text x="23" y="12.8" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
            elo
          </text>
        </svg>
      </span>
    );
  }

  if (bandeira === "Amex") {
    return (
      <span className={cn(base, "border-[#2E77BC] bg-[#2E77BC]")} aria-label="American Express">
        <svg viewBox="0 0 32 20" className="h-full w-full">
          <text x="16" y="12.8" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">
            AMEX
          </text>
        </svg>
      </span>
    );
  }

  return (
    <span className={cn(base, "text-[9px] font-semibold text-muted-foreground")} aria-label={bandeira}>
      {bandeira.slice(0, 4)}
    </span>
  );
}
