import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CommunityCard } from "@/components/CommunityCard";
import { FilterGroup, SearchInput } from "@/components/FilterGroup";
import { EmptyState } from "@/components/bits";
import { communities } from "@/data/communities";
import { CATEGORIES, PLATFORMS } from "@/data/types";
import { filterCommunities, toggleValue } from "@/lib/filters";
import { usePersonal } from "@/lib/personal";
import { followedEvents } from "@/lib/personalization";
import { publicEventsOptions, usePublicEvents } from "@/lib/event-query";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/communities")({
  loader: ({context}) => context.queryClient.ensureQueryData(publicEventsOptions),
  head: () => ({
    meta: [
      { title: "Communities — MyWorld" },
      { name: "description", content: "Discover groups on WhatsApp, Discord, Telegram and Reddit that match your interests." },
      { property: "og:title", content: "Communities — MyWorld" },
      { property: "og:description", content: "A directory of communities across platforms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Communities,
});

function Communities() {
  const {state,ready}=usePersonal();
  const events=usePublicEvents();
  const upcoming=followedEvents(events,state.marks.filter(m=>m.kind==='follow').map(m=>m.id),new Date().toISOString().slice(0,10));
  const [onlyFollowed,setOnlyFollowed]=useState(false);
  const [query, setQuery] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const results = filterCommunities(communities, { query, platforms, categories }).filter(c=>!onlyFollowed||state.marks.some(m=>m.kind==='follow'&&m.id===c.id));

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="eyebrow text-primary">Community directory</p>
        <h1 className="text-4xl font-semibold md:text-5xl">Find your people.</h1>
        <p className="max-w-xl text-muted-foreground">
          MyWorld doesn't host groups — it helps you discover them. Every community below is a
          sample for now, so join links are switched off until real, checked links are added.
        </p>
        <SearchInput value={query} onChange={setQuery} placeholder="Search communities…" />
      </header>

      <section className="space-y-4 border-b pb-6"><h2 className="text-2xl">From communities you follow</h2>{!ready?<p role="status">Loading follows…</p>:upcoming.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map(e=><EventCard key={e.id} event={e}/>)}</div>:<p className="text-sm text-muted-foreground">No upcoming events from followed communities. Follow a community below or explore all events.</p>}</section>
      <Button variant={onlyFollowed?'default':'outline'} aria-pressed={onlyFollowed} onClick={()=>setOnlyFollowed(!onlyFollowed)}>Following only</Button>
      <div className="grid gap-5 border-b pb-6 md:grid-cols-2">
        <FilterGroup label="Platform" options={PLATFORMS} selected={platforms} onToggle={(v) => setPlatforms(toggleValue(platforms, v))} />
        <FilterGroup label="Topic" options={CATEGORIES} selected={categories} onToggle={(v) => setCategories(toggleValue(categories, v))} />
      </div>

      <div className="flex items-center justify-between">
        <p className="font-mono text-sm">{results.length} communities</p>
        {(query || platforms.length > 0 || categories.length > 0) && (
          <Button variant="link" onClick={() => { setQuery(""); setPlatforms([]); setCategories([]); setOnlyFollowed(false); }}>
            Clear all filters
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyState title="No communities found" body="Try another platform or topic." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}
    </div>
  );
}
