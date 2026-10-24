import { createFileRoute, Link, useNavigate, type SearchSchemaInput } from "@tanstack/react-router";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { events, EVENT_LOCATIONS, EVENT_CAMPUSES, EVENT_SKILLS, EVENT_ELIGIBILITY } from "@/data/events";
import { EVENT_CATEGORIES, EVENT_FORMATS } from "@/data/types";
import { filterEvents, toggleValue } from "@/lib/filters";
import { EventCard } from "@/components/EventCard";
import { FilterGroup } from "@/components/FilterGroup";
import { EmptyState } from "@/components/bits";
import { Button } from "@/components/ui/button";

const list = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : typeof value === "string" && value ? [value] : [];
const text = (value: unknown): string => typeof value === "string" ? value : "";
type EventSearchInput = SearchSchemaInput & { q?: string; category?: string; categories?: string[]; formats?: string[]; locations?: string[]; skills?: string[]; eligibility?: string[]; organizers?: string[]; from?: string; until?: string; sort?: string };

export const Route = createFileRoute("/explore")({
  validateSearch: (s: EventSearchInput) => ({ q: text(s.q) || undefined, category: text(s.category) || undefined, categories: list(s.categories), formats: list(s.formats), locations: list(s.locations), skills: list(s.skills), eligibility: list(s.eligibility), organizers: list(s.organizers), from: text(s.from), until: text(s.until), sort: text(s.sort) || "upcoming" }),
  head: () => ({ meta: [{ title: "Explore Events — MyWorld" }, { name: "description", content: "Discover clearly labelled sample hackathons, workshops, meetups, conferences and competitions by city, date, format and interests." }, { property: "og:title", content: "Explore Events — MyWorld" }, { property: "og:description", content: "Find sample events in Austin, Seattle, Boston or online with transparent filters." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ExploreEvents,
});

function ExploreEvents() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const [locationInput, setLocationInput] = useState("");
  const categories = search.categories.length ? search.categories : search.category ? [search.category] : [];
  const results = filterEvents(events, { ...search, query: search.q ?? "", categories }, new Date().toISOString().slice(0, 10));
  type Facet = "categories" | "formats" | "locations" | "skills" | "eligibility" | "organizers";
  const selections = { categories, formats: search.formats, locations: search.locations, skills: search.skills, eligibility: search.eligibility, organizers: search.organizers };
  const toggle = (key: Facet, value: string) => navigate({ search: (prev) => ({ ...prev, category: undefined, [key]: toggleValue(selections[key], value), ...(key !== "categories" ? { categories } : {}) }), replace: true });
  const reset = () => navigate({ search: { q: undefined, category: undefined, categories: [], formats: [], locations: [], skills: [], eligibility: [], organizers: [], from: "", until: "", sort: "upcoming" }, replace: true });
  const active = Object.entries(selections).flatMap(([key, values]) => values.map((value) => ({ key: key as Facet, value })));
  const hasFilters = active.length > 0 || Boolean(search.q || search.from || search.until);
  return (
    <div className="space-y-7">
      <header><p className="eyebrow text-primary">Near you · Around your interests</p><h1 className="mt-2 text-4xl font-semibold md:text-5xl">Explore Events</h1><p className="mt-3 max-w-xl text-sm text-muted-foreground">Sample edition — all events, venues and organizers are illustrative, not real registrations.</p></header>
      <div className="flex items-center gap-3 rounded-md border bg-card px-4"><Search className="size-5 shrink-0 text-muted-foreground" /><input type="search" aria-label="Search events" placeholder="Search events, organizers or topics" value={search.q ?? ""} onChange={(e) => navigate({ search: (prev) => ({ ...prev, q: e.target.value || undefined }), replace: true })} className="min-h-12 w-full bg-transparent text-sm outline-none" /></div>
      <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <details open className="self-start border-y py-4 lg:border-y-0 lg:border-r lg:pr-6"><summary className="mb-5 flex cursor-pointer items-center gap-2 text-sm font-medium"><SlidersHorizontal className="size-4" />Filters</summary><div className="space-y-6">
          <FilterGroup label="Event category" options={EVENT_CATEGORIES} selected={categories} onToggle={(value) => toggle("categories", value)} />
          <FilterGroup label="Format" options={EVENT_FORMATS} selected={search.formats} onToggle={(value) => toggle("formats", value)} />
          <FilterGroup label="City" options={EVENT_LOCATIONS} selected={search.locations} onToggle={(value) => toggle("locations", value)} />
          <label className="block text-xs text-muted-foreground">Campus<select aria-label="Select campus" value="" onChange={(e) => e.target.value && toggle("locations", e.target.value)} className="mt-2 min-h-10 w-full rounded-md border bg-card px-2 text-sm"><option value="">Choose a campus</option>{EVENT_CAMPUSES.map((campus) => <option key={campus}>{campus}</option>)}</select></label>
          <form onSubmit={(e) => { e.preventDefault(); const location = locationInput.trim(); if (location && !search.locations.includes(location)) toggle("locations", location); setLocationInput(""); }}><label htmlFor="manual-location" className="text-xs text-muted-foreground">Enter a city or campus</label><div className="mt-2 flex gap-2"><input id="manual-location" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="min-h-10 w-full rounded-md border bg-card px-2 text-sm" placeholder="e.g. Austin" /><Button type="submit" size="icon" variant="outline" aria-label="Add location" disabled={!locationInput.trim()}><Search /></Button></div></form>
          <fieldset className="space-y-3"><legend className="eyebrow mb-2 text-muted-foreground">Event dates</legend><label className="block text-xs">From<input type="date" aria-label="From date" value={search.from} onChange={(e) => navigate({ search: (prev) => ({ ...prev, from: e.target.value }), replace: true })} className="mt-1 block min-h-10 w-full rounded-md border bg-card px-2" /></label><label className="block text-xs">Through<input type="date" aria-label="Through date" value={search.until} onChange={(e) => navigate({ search: (prev) => ({ ...prev, until: e.target.value }), replace: true })} className="mt-1 block min-h-10 w-full rounded-md border bg-card px-2" /></label></fieldset>
          <FilterGroup label="Skills & topics" options={EVENT_SKILLS} selected={search.skills} onToggle={(value) => toggle("skills", value)} />
          <FilterGroup label="Eligibility" options={EVENT_ELIGIBILITY} selected={search.eligibility} onToggle={(value) => toggle("eligibility", value)} />
          <label className="block text-xs text-muted-foreground">Organizer<select aria-label="Select organizer" value="" onChange={(e) => e.target.value && toggle("organizers", e.target.value)} className="mt-2 min-h-10 w-full rounded-md border bg-card px-2 text-sm"><option value="">Choose an organizer</option>{[...new Set(events.map((event) => event.organizer))].sort().map((organizer) => <option key={organizer}>{organizer}</option>)}</select></label>
        </div></details>
        <section className="min-w-0 space-y-5" aria-label="Event results">
          <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" className="font-mono text-sm">{results.length} {results.length === 1 ? "event" : "events"}</p><label className="flex items-center gap-2 text-xs text-muted-foreground">Sort by<select aria-label="Sort events" value={search.sort === "relevance" ? "relevance" : "upcoming"} onChange={(e) => navigate({ search: (prev) => ({ ...prev, sort: e.target.value }), replace: true })} className="min-h-10 rounded-md border bg-card px-2 text-sm text-foreground"><option value="upcoming">Upcoming date</option><option value="relevance">Keyword relevance</option></select></label></div>
          {hasFilters && <div className="flex flex-wrap gap-2">{active.map(({ key, value }) => <Button key={`${key}-${value}`} size="sm" variant="secondary" aria-label={`Remove ${value} filter`} onClick={() => toggle(key, value)}>{value}<X /></Button>)}{(["q", "from", "until"] as const).filter((key) => search[key]).map((key) => <Button key={key} size="sm" variant="secondary" aria-label={`Remove ${key} filter`} onClick={() => navigate({ search: (prev) => ({ ...prev, [key]: key === "q" ? undefined : "" }), replace: true })}>{key === "q" ? "Search" : key === "from" ? "From" : "Through"}: {search[key]}<X /></Button>)}<Button size="sm" variant="link" onClick={reset}>Reset Filters</Button></div>}
          {results.length ? <div className="grid gap-4 sm:grid-cols-2">{results.map((event) => <EventCard key={event.id} event={event} />)}</div> : <EmptyState title="No events match just yet" body="Try another city, broaden your dates or remove a filter. Online events are listed under Virtual." action={<Button onClick={reset}>Reset Filters</Button>} />}
          <Link to="/resources" className="inline-block text-sm text-primary hover:underline">Looking for learning resources or other updates?</Link>
        </section>
      </div>
    </div>
  );
}