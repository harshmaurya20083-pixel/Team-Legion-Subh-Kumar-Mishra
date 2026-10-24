import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, Search } from "lucide-react";
import { useState } from "react";
import { CommunityCard } from "@/components/CommunityCard";
import { InfoCard } from "@/components/InfoCard";
import { SectionHeading } from "@/components/bits";
import { communities } from "@/data/communities";
import { informationItems } from "@/data/information";
import { CATEGORIES } from "@/data/types";
import { Button } from "@/components/ui/button";
import { publicEventsOptions, usePublicEvents } from "@/lib/event-query";
import { EventCard } from "@/components/EventCard";
import { EVENT_CATEGORIES } from "@/data/types";
import { filterEvents } from "@/lib/filters";
import { usePersonal } from "@/lib/personal";
import { recommendEvents } from "@/lib/personalization";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicEventsOptions),
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
  const events = usePublicEvents();
  const { state, ready } = usePersonal();
  const recommendations = recommendEvents(events, state.preferences, new Date().toISOString().slice(0,10));
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const byDate = [...informationItems].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = byDate;
  const grid = rest.slice(0, 4);
  const recent = rest.slice(4, 9);
  const upcoming = filterEvents(events, { query: "", categories: [], formats: [], locations: [], skills: [], eligibility: [], organizers: [], from: "", until: "", sort: "upcoming" }, new Date().toISOString().slice(0, 10));

  return (
    <div className="space-y-14">
      {/* Intro + search */}
      <section className="space-y-6 border-b pb-8">
        <div>
          <p className="eyebrow text-primary">Issue 01 · Sample edition</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">
            MyWorld, <em className="text-primary">closer to you.</em>
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Find events, useful opportunities and your next community.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/explore", search: { q: q.trim() || undefined } });
          }}
          className="flex max-w-2xl items-center gap-2 rounded-md border border-foreground/30 bg-card p-2 focus-within:border-primary"
        >
          <Search className="ml-1 h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try 'internship' or 'react'"
            aria-label="Search information"
            className="w-full bg-transparent py-1 outline-none"
          />
           <Button type="submit">Search</Button>
        </form>
        <Link to="/internships" className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><BriefcaseBusiness className="size-4" />Internship Opportunities<ArrowRight className="size-4" /></Link>
      </section>

      <section><SectionHeading eyebrow="Reviewed events · Labelled samples" title="Coming up next" action={<Link to="/explore" className="text-sm text-primary">Explore Events</Link>} /><div className="mb-5 flex flex-wrap gap-2">{EVENT_CATEGORIES.map((category) => <Button key={category} asChild variant="outline" size="sm"><Link to="/explore" search={{ category }}>{category}</Link></Button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{upcoming.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)}</div></section>

      <section><SectionHeading eyebrow="Based on your choices" title="For you" action={<Link to="/preferences" className="text-sm text-primary">Edit preferences</Link>} />{!ready ? <p role="status">Loading your recommendations…</p> : recommendations.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{recommendations.slice(0,6).map(({event,reasons})=><div key={event.id} className="space-y-3"><EventCard event={event}/><ul className="space-y-1 text-xs text-primary">{reasons.map(r=><li key={r}>{r}</li>)}</ul></div>)}</div> : <p className="text-sm text-muted-foreground">No preference matches yet. Choose interests or a location in Preferences, or explore all events.</p>}</section>

      {featured && <InfoCard item={featured} variant="featured" />}

      {/* Topics */}
      <section>
        <SectionHeading eyebrow="Discover by topic" title="Pick a thread" />
        <div className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((c, index) => {
            const count = informationItems.filter((i) => i.category === c).length;
            return (
              <Link
                key={c}
                 to="/resources"
                search={{ category: c }}
                className="group bg-background p-4 transition-colors hover:bg-foreground hover:text-background"
              >
                <span className="font-mono text-xs text-muted-foreground group-hover:text-background/60">
                  {index < 5 ? String(index + 3).padStart(2, "0") : String(count).padStart(2, "0")}
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
            action={<Link to="/resources" className="text-sm text-primary hover:underline">See all</Link>}
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
