// Keep unavailable bookmarks visible without revealing hidden listing details.
export function unavailableSavedIds(savedIds: string[], available: { id: string }[]): string[] {
  const known = new Set(available.map(item => item.id));
  return [...new Set(savedIds)].filter(id => !known.has(id));
}