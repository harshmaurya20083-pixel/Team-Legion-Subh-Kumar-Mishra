import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, CONTENT_TYPES } from "@/data/types";

export const Route = createFileRoute("/preferences")({
  head: () => ({
    meta: [
      { title: "Preferences — MyWorld" },
      { name: "description", content: "A preview of how MyWorld will adapt to your interests and goals." },
      { property: "og:title", content: "Preferences — MyWorld" },
      { property: "og:description", content: "Coming soon: a feed shaped by your interests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Preferences,
});

const GOALS = ["Land an internship", "Learn to code", "Start a side project", "Meet people nearby"];

function Preview({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="border bg-card p-5">
      <p className="eyebrow mb-3 text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="border px-2.5 py-1 text-xs text-muted-foreground">{i}</span>
        ))}
      </div>
    </div>
  );
}

function Preferences() {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="eyebrow text-primary">Coming in Round 2</p>
        <h1 className="mt-2 text-4xl font-semibold md:text-5xl">A feed that knows what you care about.</h1>
        <p className="mt-4 text-muted-foreground">
          Right now everyone sees the same sample feed — nothing is personalised yet. In the next
          round, you'll be able to tell MyWorld your interests, goals and preferred kinds of content,
          and your feed will be arranged around them.
        </p>
      </header>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Preview</h2>
          <span className="eyebrow border border-sample px-1.5 py-0.5 text-[0.6rem]">Not active</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Preview title="Interests" items={CATEGORIES} />
          <Preview title="Learning goals" items={GOALS} />
          <Preview title="Preferred content" items={CONTENT_TYPES} />
          <div className="border bg-card p-5">
            <p className="eyebrow mb-3 text-muted-foreground">Location</p>
            <p className="text-sm text-muted-foreground">
              Optional, city-level only — used to surface nearby events. We'll never ask for more than you need.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
