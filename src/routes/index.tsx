import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { CommunityCard } from "@/components/CommunityCard";
import { InfoCard } from "@/components/InfoCard";
import { SectionHeading } from "@/components/bits";
import { communities } from "@/data/communities";
import { informationItems } from "@/data/information";
import { CATEGORIES } from "@/data/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyWorld — Discover information & communities that matter to you" },
      { name: "description", content: "MyWorld brings learning resources, opportunities, updates and communities into one discoverable space." },
      { property: "og:title", content: "MyWorld — Your discovery feed" },
      { property: "og:description", content: "Discover useful information, opportunities and communities in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const byDate = [...informationItems].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = byDate;
  const grid = rest.slice(0, 4);
  const recent = rest.slice(4, 9);

  return (
    <div className="space-y-14">
      {/* Intro + search */}
      <section className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <p className="eyebrow text-primary">Issue 01 · Sample edition</p>
          <h1 className="mt-2 text-4xl font-semibold leading-[1.05] md:text-6xl">
            Your world, <em className="text-primary">gathered</em> in one place.
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            MyWorld collects learning resources, opportunities, local updates and communities so you
            can find what's useful without searching ten different apps.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/explore", search: { q: q.trim() || undefined } });
          }}
          className="flex items-center gap-2 border-2 border-foreground bg-card p-2"
        >
          <Search className="ml-1 h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try 'internship' or 'react'"
            aria-label="Search information"
            className="w-full bg-transparent py-1 outline-none"
          />
          <button className="bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">Search</button>
        </form>
      </section>

      <InfoCard item={featured} variant="featured" />

      {/* Topics */}
      <section>
        <SectionHeading eyebrow="Discover by topic" title="Pick a thread" />
        <div className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((c) => {
            const count = informationItems.filter((i) => i.category === c).length;
            return (
              <Link
                key={c}
                to="/explore"
                search={{ category: c }}
                className="group bg-background p-4 transition-colors hover:bg-foreground hover:text-background"
              >
                <span className="font-mono text-xs text-muted-foreground group-hover:text-background/60">
                  {String(count).padStart(2, "0")}
                </span>
                <p className="mt-6 font-display text-lg">{c}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Main feed + recent */}
      <section className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <SectionHeading
            eyebrow="The feed"
            title="Worth your time"
            action={<Link to="/explore" className="text-sm text-primary hover:underline">See all</Link>}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {grid.map((item) => (
              <InfoCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Recently added" title="Latest" />
          <div>
            {recent.map((item) => (
              <InfoCard key={item.id} item={item} variant="row" />
            ))}
          </div>
        </div>
      </section>

      {/* Communities preview */}
      <section>
        <SectionHeading
          eyebrow="Find your people"
          title="Communities to explore"
          action={
            <Link to="/communities" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Directory <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {communities.slice(0, 3).map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
