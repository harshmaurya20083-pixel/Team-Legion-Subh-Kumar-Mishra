import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FilterGroup, SearchInput } from "@/components/FilterGroup";
import { InfoCard } from "@/components/InfoCard";
import { EmptyState } from "@/components/bits";
import { informationItems } from "@/data/information";
import { CATEGORIES, CONTENT_TYPES, SOURCE_TYPES } from "@/data/types";
import { filterInformation, toggleValue } from "@/lib/filters";

// The URL can carry a starting search (?q=) or topic (?category=) from other pages.
interface ExploreSearch {
  q?: string;
  category?: string;
}

export const Route = createFileRoute("/explore")({
  validateSearch: (s: Record<string, unknown>): ExploreSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore — MyWorld" },
      { name: "description", content: "Search and filter resources, opportunities, events and updates by topic and source." },
      { property: "og:title", content: "Explore — MyWorld" },
      { property: "og:description", content: "Search and filter everything on MyWorld." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Explore,
});

function Explore() {
  const initial = Route.useSearch();
  const [query, setQuery] = useState(initial.q ?? "");
  const [categories, setCategories] = useState<string[]>(initial.category ? [initial.category] : []);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [sourceTypes, setSourceTypes] = useState<string[]>([]);

  const results = filterInformation(informationItems, { query, categories, contentTypes, sourceTypes });
  const anyFilter = query || categories.length || contentTypes.length || sourceTypes.length;

  const clearAll = () => {
    setQuery("");
    setCategories([]);
    setContentTypes([]);
    setSourceTypes([]);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-primary">Explore</p>
        <SearchInput value={query} onChange={setQuery} placeholder="Search titles, sources, tags…" />
      </header>

      <div className="grid gap-5 border-b pb-6 md:grid-cols-3">
        <FilterGroup label="Category" options={CATEGORIES} selected={categories} onToggle={(v) => setCategories(toggleValue(categories, v))} />
        <FilterGroup label="Content type" options={CONTENT_TYPES} selected={contentTypes} onToggle={(v) => setContentTypes(toggleValue(contentTypes, v))} />
        <FilterGroup label="Source type" options={SOURCE_TYPES} selected={sourceTypes} onToggle={(v) => setSourceTypes(toggleValue(sourceTypes, v))} />
      </div>

      <div className="flex items-center justify-between">
        <p className="font-mono text-sm">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
        {anyFilter ? (
          <button onClick={clearAll} className="text-sm text-primary hover:underline">
            Clear all filters
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="Nothing matches yet"
          body="Try a shorter search term or remove a filter or two."
          action={<button onClick={clearAll} className="bg-foreground px-4 py-2 text-sm text-background">Clear all filters</button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <InfoCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
