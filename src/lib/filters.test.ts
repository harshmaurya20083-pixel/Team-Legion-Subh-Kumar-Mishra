import { describe, expect, it } from "vitest";
import { communities } from "@/data/communities";
import { informationItems } from "@/data/information";
import { filterCommunities, filterInformation, isValidUrl } from "./filters";

const none = { query: "", categories: [], contentTypes: [], sourceTypes: [] };

describe("filters", () => {
  it("search is case-insensitive and matches tags", () => {
    const r = filterInformation(informationItems, { ...none, query: "HACKATHON" });
    expect(r.map((i) => i.id)).toContain("i2");
  });

  it("combines category and content type filters", () => {
    const r = filterInformation(informationItems, { ...none, categories: ["Technology"], contentTypes: ["Events"] });
    expect(r.map((i) => i.id)).toEqual(["i2"]);
  });

  it("filters communities by platform", () => {
    const r = filterCommunities(communities, { query: "", platforms: ["Reddit"], categories: [] });
    expect(r.every((c) => c.platform === "Reddit")).toBe(true);
    expect(r.length).toBe(2);
  });

  it("treats missing or non-http links as unavailable", () => {
    expect(isValidUrl(undefined)).toBe(false);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("https://example.org")).toBe(true);
  });
});
