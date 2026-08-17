import { Link } from "@tanstack/react-router";
import { Coins } from "lucide-react";

export function CreditPill({ credits }: { credits: number }) {
  return (
    <Link
      to="/wallet"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-muted"
    >
      <Coins className="size-3.5 text-primary" aria-hidden />
      {credits} Credits
    </Link>
  );
}
