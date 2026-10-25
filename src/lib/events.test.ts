import { describe, expect, it } from "vitest";
import { events } from "@/data/events";
import { canRegister, eventRelevance, filterEvents, type EventFilters } from "./filters";

const empty: EventFilters = { query: "", categories: [], formats: [], locations: [], skills: [], eligibility: [], organizers: [], from: "", until: "", sort: "upcoming" };
const today = "2026-10-24";
const fixture = events[0];
if (!fixture) throw new Error("Missing event fixture");

describe("Event discovery rules", () => {
  it("searches titles, descriptions, organizers and tags case-insensitively", () => {
    for (const query of ["CAMPUS BUILD", "prototype", "Campus Hackathon Teams", "teams"]) expect(filterEvents(events, { ...empty, query }, today).map((event) => event.id)).toContain("event-austin-build");
  });
  it("combines category, format, city, skills and eligibility", () => {
    expect(filterEvents(events, { ...empty, categories: ["Hackathons"], formats: ["Offline"], locations: ["Mumbai"], skills: ["JavaScript"], eligibility: ["College students"] }, today).map((event) => event.id)).toEqual(["event-austin-build"]);
  });
  it("supports manual campus selection and unknown location empty results", () => {
    expect(filterEvents(events, { ...empty, locations: ["mumbai central campus"] }, today).map((event) => event.id)).toEqual(["event-austin-build", "event-austin-pitch"]);
    expect(filterEvents(events, { ...empty, locations: ["Unlisted city"] }, today)).toEqual([]);
  });
  it("Virtual selects online events without assigning invented distances", () => {
    expect(filterEvents(events, { ...empty, locations: ["Virtual"] }, today).map((event) => event.id)).toEqual(["event-virtual-react", "event-virtual-accessibility"]);
  });
  it("uses inclusive event start-date bounds", () => {
    expect(filterEvents(events, { ...empty, from: "2026-11-03", until: "2026-11-06" }, today).map((event) => event.id)).toEqual(["event-seattle-design", "event-seattle-python"]);
  });
  it("sorts by upcoming date and ranks title matches above description matches", () => {
    expect(filterEvents(events, empty, today)[0]?.id).toBe("event-virtual-react");
    const titleMatch = { ...fixture, id: "title", title: "React workshop", description: "", organizer: "", tags: [], date: "2026-12-01" };
    const descriptionMatch = { ...fixture, id: "description", title: "Workshop", description: "React", organizer: "", tags: [] };
    expect(eventRelevance(titleMatch, "react")).toBe(4);
    expect(filterEvents([descriptionMatch, titleMatch], { ...empty, query: "react", sort: "relevance" }, today).map((event) => event.id)).toEqual(["title", "description"]);
  });
  it("excludes unpublished, unapproved and expired events", () => {
    expect(filterEvents([{ ...fixture, status: "pending" }, { ...fixture, reviewStatus: "pending" }, { ...fixture, date: "2026-01-01", endDate: "2026-01-02" }], empty, today)).toEqual([]);
  });
  it("filters organizers by supplied identity", () => {
    expect(filterEvents(events, { ...empty, organizers: ["Frontend Learners Circle"] }, today).map((event) => event.id)).toEqual(["event-virtual-react", "event-boston-web"]);
  });
  it("sample events cannot register even with a syntactically valid URL", () => {
    expect(canRegister({ ...fixture, registrationUrl: "https://example.org" }, today)).toBe(false);
  });
  it("live registrations require an approved record, valid URL and open deadline", () => {
    const live = { ...fixture, isSample: false, registrationUrl: "https://example.org" };
    expect(canRegister(live, today)).toBe(true);
    expect(canRegister({ ...live, registrationUrl: "javascript:alert(1)" }, today)).toBe(false);
    expect(canRegister({ ...live, registrationDeadline: "2026-10-23" }, today)).toBe(false);
    expect(canRegister({ ...live, reviewStatus: "pending" }, today)).toBe(false);
  });
});