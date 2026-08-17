import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, Sparkles, Repeat2, Trophy } from "lucide-react";

import { ALBUM_NAME, EXPECTED_BASE_COUNT } from "@/lib/album";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StickerSwap — No buying. No selling. Just trading." },
      {
        name: "description",
        content:
          "Trade Panini FIFA World Cup 2026 stickers with collectors near you. List what you have and need, and we find mutual matches.",
      },
      { property: "og:title", content: "StickerSwap — No buying. No selling. Just trading." },
      {
        property: "og:description",
        content: "Complete your album. Trade your duplicates. $5 to join.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    icon: BookOpen,
    title: "Build Your Album",
    body: "Mark what you have and what you need.",
  },
  {
    icon: Sparkles,
    title: "Find Matches",
    body: "We find collectors who have what you're missing.",
  },
  { icon: Repeat2, title: "Trade", body: "Swap up to five stickers at a time." },
  {
    icon: Trophy,
    title: "Complete the Album",
    body: `Track your progress toward all ${EXPECTED_BASE_COUNT} stickers.`,
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <p className="text-lg font-extrabold tracking-tight text-foreground">
          Sticker<span className="text-primary">Swap</span>
        </p>
        <Link
          to="/dashboard"
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Sign in
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-14 pt-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-foreground">
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          {ALBUM_NAME}
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-extrabold leading-[1.05] text-foreground sm:text-6xl">
          Complete the album <span className="text-gradient-primary">together.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base font-semibold text-foreground/80">
          No buying. No selling. Just trading.
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Complete your album. Trade your duplicates.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/onboarding"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-[1.02] sm:w-auto"
          >
            Join for $5 <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto"
          >
            See How It Works
          </a>
        </div>

        <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-3">
          {[
            { k: `${EXPECTED_BASE_COUNT}`, v: "base stickers" },
            { k: "48", v: "national teams" },
            { k: "$1", v: "per completed trade" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <p className="text-2xl font-extrabold text-foreground">{s.k}</p>
              <p className="text-[11px] text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-2xl font-extrabold text-foreground">How it works</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <article
                key={step.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="size-4.5" aria-hidden />
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-xl font-extrabold text-foreground">Trade-only, by design</h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "$5 one-time membership to join",
              "1 Trade Credit per completed trade",
              "Up to 5 stickers from each collector",
              "No prices, no bidding, no cash offers",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-have" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
          <Link
            to="/onboarding"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Start my album <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        StickerSwap — collectors decide what's fair. We just find the match.
      </footer>
    </div>
  );
}
