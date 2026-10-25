import { describe, expect, it } from 'vitest';
import { unavailableSavedIds } from './saved-items';
describe('unavailable bookmarks', () => {
  it('keeps an unavailable event bookmark instead of reporting an empty shelf', () => {
    expect(unavailableSavedIds(['event-archived', 'i1'], [{ id: 'i1' }])).toEqual(['event-archived']);
  });
  it('does not mark saved internships or published events unavailable', () => {
    expect(unavailableSavedIds(['event-live', 'internship-web-sample'], [{ id: 'event-live' }, { id: 'internship-web-sample' }])).toEqual([]);
  });
});