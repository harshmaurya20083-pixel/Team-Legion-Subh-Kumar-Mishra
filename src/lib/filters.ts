// Plain functions for search and filtering. No React here, so they are easy to test.
import type { Community, InfoItem } from "@/data/types";

/** Case-insensitive "does any of these texts contain the query?" */
function matchesQuery(query: string, fields: string[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field.toLowerCase().includes(q));
}

/** An empty selection means "no filter" — everything passes. */
function matchesSelection<T>(selected: T[], value: T): boolean {
  return selected.length === 0 || selected.includes(value);
}

export interface InfoFilters {
  query: string;
  categories: string[];
  contentTypes: string[];
  sourceTypes: string[];
}

export function filterInformation(items: InfoItem[], f: InfoFilters): InfoItem[] {
  return items.filter(
    (item) =>
      matchesQuery(f.query, [item.title, item.summary, item.sourceName, ...item.tags]) &&
      matchesSelection(f.categories, item.category) &&
      matchesSelection(f.contentTypes, item.contentType) &&
      matchesSelection(f.sourceTypes, item.sourceType),
  );
}

export interface CommunityFilters {
  query: string;
  platforms: string[];
  categories: string[];
}

export function filterCommunities(list: Community[], f: CommunityFilters): Community[] {
  return list.filter(
    (c) =>
      matchesQuery(f.query, [c.name, c.description, c.audience ?? "", ...c.tags]) &&
      matchesSelection(f.platforms, c.platform) &&
      matchesSelection(f.categories, c.category),
  );
}

/** Add the value if missing, remove it if present. */
export function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** Only accept real http(s) links. Anything else is treated as "no link". */
export function isValidUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
