import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { ProgressMeter } from "@/components/app/ProgressMeter";
import { countries, stickerById } from "@/lib/album";
import { cn } from "@/lib/utils";
import { useStore } from "@/mocks/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Join StickerSwap — 4 quick steps" },
      {
        name: "description",
        content:
          "Create your collector account, pay the $5 membership, mark what you have and need, then see your matches.",
      },
      { property: "og:title", content: "Join StickerSwap — 4 quick steps" },
      { property: "og:description", content: "Under two minutes to your first trade match." },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["Account", "Membership", "Have & Need", "Your matches"];

function Onboarding() {
  const navigate = useNavigate();
  const { matches, joinMembership, setOwned, setWanted, inventory } = useStore();
  const [step, setStep] = useState(0);
  const [paid, setPaid] = useState(false);

  const seedStickers = useMemo(
    () => countries.slice(0, 4).flatMap((c) => c.stickers.slice(2, 8)),
    [],
  );

  const mutual = matches.filter((m) => m.mutual);
  const helpers = matches.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto max-w-2xl px-5 pt-6">
        <Link to="/" className="text-sm font-extrabold text-foreground">
          Sticker<span className="text-primary">Swap</span>
        </Link>
        <div className="mt-4 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={cn(
                  "h-1.5 rounded-full",
                  i <= step ? "bg-primary" : "bg-muted",
                )}
              />
              <p
                className={cn(
                  "mt-1.5 truncate text-[10px] font-semibold",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        {step === 0 ? (
          <section>
            <h1 className="text-2xl font-extrabold text-foreground">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Collectors trade with verified profiles only.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {["Continue with Google", "Continue with Apple"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="my-5 flex items-center gap-3 text-[11px] uppercase text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or email <span className="h-px flex-1 bg-border" />
            </div>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(1);
              }}
            >
              <input
                type="text"
                placeholder="Username"
                aria-label="Username"
                className="rounded-full border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="rounded-full border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="City"
                  aria-label="City"
                  className="rounded-full border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  placeholder="ZIP"
                  aria-label="ZIP code"
                  className="rounded-full border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground"
              >
                Continue <ArrowRight className="size-4" aria-hidden />
              </button>
            </form>
          </section>
        ) : null}

        {step === 1 ? (
          <section>
            <h1 className="text-2xl font-extrabold text-foreground">Join for $5</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              One-time membership. Required before you can initiate or accept trades.
            </p>
            <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <p className="text-3xl font-extrabold text-foreground">
                $5 <span className="text-sm font-semibold text-muted-foreground">one-time</span>
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                {[
                  "Unlimited matching and proposals",
                  "Trade Credits from $1 per completed trade",
                  "Up to 5 stickers each side, every trade",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-have" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  joinMembership();
                  setPaid(true);
                  setStep(2);
                }}
                className="mt-5 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground"
              >
                Pay $5 and continue
              </button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Checkout is simulated in this preview build.
              </p>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h1 className="text-2xl font-extrabold text-foreground">What do you have and need?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap through a few now — you can finish the whole album later.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-2">
              {seedStickers.map((sticker) => {
                const item = inventory.find((i) => i.stickerId === sticker.id);
                const owned = (item?.quantityOwned ?? 0) > 0;
                return (
                  <div
                    key={sticker.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-secondary">
                      {sticker.flag || "🏆"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">
                        {sticker.code} — {sticker.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{sticker.country}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWanted(sticker.id, true)}
                      className={cn(
                        "rounded-full px-3 py-2 text-xs font-semibold",
                        item?.wanted && !owned
                          ? "bg-need text-need-foreground"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      Need
                    </button>
                    <button
                      type="button"
                      onClick={() => setOwned(sticker.id, owned ? 2 : 1)}
                      className={cn(
                        "rounded-full px-3 py-2 text-xs font-semibold",
                        owned ? "bg-have text-have-foreground" : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {owned ? "Duplicate +1" : "Have"}
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="mt-5 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground"
            >
              Find my matches
            </button>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="text-center">
            <p className="text-5xl">🎯</p>
            <h1 className="mt-3 text-3xl font-extrabold text-foreground animate-in fade-in zoom-in-95 duration-500">
              {matches.length} Trade Matches Found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {helpers} collectors have stickers you need.
              <br />
              {mutual.length} have mutual matches right now.
            </p>
            <div className="mx-auto mt-6 max-w-sm rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-lift)]">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Top match
              </p>
              {mutual[0] ? (
                <>
                  <p className="mt-1 text-lg font-extrabold text-foreground">
                    {mutual[0].collector.displayName} {mutual[0].collector.flag}
                  </p>
                  <p className="text-2xl font-extrabold text-gradient-primary">
                    {mutual[0].score}% Trade Match
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Can give you{" "}
                    {mutual[0].theyHave
                      .slice(0, 3)
                      .map((id) => stickerById.get(id)?.code)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Mark a few more stickers to unlock mutual matches.
                </p>
              )}
              <ProgressMeter value={mutual[0]?.score ?? 20} className="mt-3" />
            </div>
            <button
              type="button"
              disabled={!paid}
              onClick={() => navigate({ to: "/matches" })}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] disabled:opacity-40"
            >
              <Sparkles className="size-4" aria-hidden /> Find My Best Trade
            </button>
          </section>
        ) : null}
      </main>
    </div>
  );
}
