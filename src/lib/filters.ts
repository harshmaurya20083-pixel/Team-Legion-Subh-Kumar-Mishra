// Plain functions for search and filtering. No React here, so they are easy to test.
import type { Community, DiscoveryEvent, InfoItem } from "@/data/types";

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

export interface EventFilters {
  query: string;
  categories: string[];
  formats: string[];
  locations: string[];
  skills: string[];
  eligibility: string[];
  organizers: string[];
  from: string;
  until: string;
  sort: string;
}

/** Deterministic keyword ranking; no inferred ability or personal score. */
export function eventRelevance(event: DiscoveryEvent, query: string): number {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return terms.reduce((score, term) => score
    + (event.title.toLowerCase().includes(term) ? 4 : 0)
    + (event.organizer.toLowerCase().includes(term) ? 2 : 0)
    + (event.tags.some((tag) => tag.toLowerCase().includes(term)) ? 2 : 0)
    + (event.description.toLowerCase().includes(term) ? 1 : 0), 0);
}

export function filterEvents(list: DiscoveryEvent[], f: EventFilters, today: string): DiscoveryEvent[] {
  const terms = f.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const validDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);
  const from = validDate(f.from) ? f.from : today;
  const until = validDate(f.until) ? f.until : "9999-12-31";
  return list.filter((event) => {
    const text = [event.title, event.description, event.organizer, ...event.tags].join(" ").toLowerCase();
    return event.status === "published" && event.reviewStatus === "approved"
      && event.endDate >= today && event.date >= from && event.date <= until
      && terms.every((term) => text.includes(term))
      && matchesSelection(f.categories, event.category)
      && matchesSelection(f.formats, event.format)
      && (f.locations.length === 0 || f.locations.some((location) => [event.city, event.campus].some((value) => value.toLowerCase() === location.toLowerCase().trim())))
      && (f.skills.length === 0 || f.skills.some((skill) => event.skills.includes(skill)))
      && (f.eligibility.length === 0 || f.eligibility.some((value) => event.eligibility.includes(value)))
      && matchesSelection(f.organizers, event.organizer);
  }).sort((a, b) => (f.sort === "relevance" ? eventRelevance(b, f.query) - eventRelevance(a, f.query) : 0)
    || a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

/** Samples and closed registrations never offer an actionable registration link. */
export function canRegister(event: DiscoveryEvent, today: string): boolean {
  return !event.isSample && event.status === "published" && event.reviewStatus === "approved"
    && event.endDate >= today && (!event.registrationDeadline || event.registrationDeadline >= today)
    && isValidUrl(event.registrationUrl);
}
