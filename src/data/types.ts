// Shared shapes for every piece of data in MyWorld.
// Keeping these in one place makes it easy to swap sample data for real sources later.

export const CATEGORIES = [
  "Technology",
  "Education",
  "Careers",
  "Business",
  "Local",
  "Culture",
  "General News",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CONTENT_TYPES = [
  "News",
  "Opportunities",
  "Events",
  "Resources",
  "Community Updates",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const SOURCE_TYPES = ["News Source", "Organization", "Learning Platform", "Community"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const PLATFORMS = ["WhatsApp", "Discord", "Telegram", "Reddit"] as const;
export type Platform = (typeof PLATFORMS)[number];

export interface InfoItem {
  id: string;
  title: string;
  summary: string;
  category: Category;
  contentType: ContentType;
  sourceName: string;
  sourceType: SourceType;
  date: string; // ISO date, e.g. "2026-10-20"
  tags: string[];
  url?: string; // optional — only set when a real, valid link exists
  isSample: boolean;
}

export interface Community {
  id: string;
  name: string;
  platform: Platform;
  category: Category;
  description: string;
  tags: string[];
  audience?: string;
  location?: string; // "Online" or a place
  url?: string; // never invent invite links — leave empty for sample groups
  isSample: boolean;
}

export const EVENT_CATEGORIES = ["Hackathons", "Workshops", "Meetups", "Conferences", "Competitions"] as const;
export const EVENT_FORMATS = ["Online", "Offline", "Hybrid"] as const;
export interface DiscoveryEvent {
  id: string;
  title: string;
  description: string;
  category: (typeof EVENT_CATEGORIES)[number];
  format: (typeof EVENT_FORMATS)[number];
  city: string;
  campus: string;
  venue: string;
  onlineDetails?: string;
  date: string;
  endDate: string;
  timeZone: string;
  schedule: { time: string; activity: string }[];
  registrationDeadline?: string;
  organizer: string;
  organizerDescription: string;
  communityId?: string;
  eligibility: string[];
  eligibilityDetails: string;
  skills: string[];
  skillsDetails: string;
  tags: string[];
  registrationUrl?: string;
  sourceUrl?: string;
  sourceName: string;
  updatedAt: string;
  status: "published" | "pending" | "archived";
  reviewStatus: "approved" | "pending" | "rejected";
  isSample: boolean;
}
