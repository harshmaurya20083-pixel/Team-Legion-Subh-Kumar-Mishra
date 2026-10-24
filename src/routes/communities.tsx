import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CommunityCard } from "@/components/CommunityCard";
import { FilterGroup, SearchInput } from "@/components/FilterGroup";
import { EmptyState } from "@/components/bits";
import { communities } from "@/data/communities";
import { CATEGORIES, PLATFORMS } from "@/data/types";
import { filterCommunities, toggleValue } from "@/lib/filters";

export const Route = createFileRoute("/communities")({
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
  const [query, setQuery] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const results = filterCommunities(communities, { query, platforms, categories });

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

      <div className="grid gap-5 border-b pb-6 md:grid-cols-2">
        <FilterGroup label="Platform" options={PLATFORMS} selected={platforms} onToggle={(v) => setPlatforms(toggleValue(platforms, v))} />
        <FilterGroup label="Topic" options={CATEGORIES} selected={categories} onToggle={(v) => setCategories(toggleValue(categories, v))} />
      </div>

      <div className="flex items-center justify-between">
        <p className="font-mono text-sm">{results.length} communities</p>
        {(query || platforms.length > 0 || categories.length > 0) && (
          <button onClick={() => { setQuery(""); setPlatforms([]); setCategories([]); }} className="text-sm text-primary hover:underline">
            Clear all filters
          </button>
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
