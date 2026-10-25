import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Guard the privileged RPC's field projections, not UI copy.
const migration = readFileSync('drizzle/migrations/0004_protect_private_duplicate_matches.sql', 'utf8');
describe('private duplicate projection', () => {
  it.each(['title', 'date', 'city'])('guards %s for unpublished submissions from other owners', field => {
    const projection = migration.match(new RegExp(`'${field}',CASE WHEN ([\\s\\S]*?) END`));
    expect(projection?.[1]).toMatch(/e\.status='published' OR e\.submitter_id=auth\.uid\(\) OR public\.has_role\(auth\.uid\(\),'admin'\)/);
    expect(projection?.[1]).toContain(`THEN e.event->>'${field}' ELSE`);
  });
});