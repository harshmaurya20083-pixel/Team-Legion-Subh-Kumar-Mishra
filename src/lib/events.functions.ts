import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { events } from '@/data/events';
import { duplicateSchema, eventPayload, fixtureDuplicates, moderationSchema, submissionSchema, storedEventSchema } from './submission';
import type { DiscoveryEvent } from '@/data/types';
import type { Database } from '@/integrations/supabase/types';

export const listPublishedEvents = createServerFn({ method: 'GET' }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error('Event service is unavailable');
  const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization'); h.set('apikey', key); return fetch(input, { ...init, headers: h }); } } });
  const result: DiscoveryEvent[] = [...events];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client.from('event_records').select('id,event,updated_at').eq('status', 'published').order('id').range(offset, offset + 499);
    if (error) throw new Error('Unable to load published events');
    for (const row of data ?? []) {
      const parsed = storedEventSchema.safeParse(row.event);
      if (parsed.success) result.push({ ...parsed.data, id: `event-${row.id}`, status: 'published', reviewStatus: 'approved', updatedAt: row.updated_at.slice(0, 10) });
    }
    if (!data || data.length < 500) break;
  }
  return result;
});
export const checkSubmission = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(v => submissionSchema.parse(v)).handler(async ({ data, context }) => {
  const { data: matches, error } = await context.supabase.rpc('check_event_duplicates', { candidate: eventPayload(data) });
  if (error) throw new Error('Could not check duplicates. Please try again.');
  return [...fixtureDuplicates(data, events), ...z.array(duplicateSchema).parse(matches)];
});
export const submitEvent = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(v => z.object({ event: submissionSchema, acknowledged: z.boolean() }).parse(v)).handler(async ({ data, context }) => {
  const sampleMatches = fixtureDuplicates(data.event, events);
  if (sampleMatches.length && !data.acknowledged) return { needsAcknowledgement: true, matches: sampleMatches };
  const { data: result, error } = await context.supabase.rpc('submit_event', { candidate: eventPayload(data.event), contact: data.event.contactEmail, acknowledged: data.acknowledged });
  if (error) throw new Error('Submission could not be saved. Check your fields and try again.');
  return z.object({ id: z.string().optional(), needsAcknowledgement: z.boolean(), matches: z.array(duplicateSchema) }).parse(result);
});
export const listOwnSubmissions = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from('event_records').select('id,event,status,review_reason,created_at').eq('submitter_id', context.userId).order('created_at', { ascending: false });
  if (error) throw new Error('Could not load your submissions');
  return data ?? [];
});
export const adminQueue = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: admin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (!admin) throw new Error('Administrator access required. No moderation records are available to this account.');
  const { data, error } = await context.supabase.from('event_records').select('*,event_contacts(contact_email)').order('created_at', { ascending: false });
  if (error) throw new Error('Could not load moderation queue');
  return (data ?? []).map(row => {
    const parsed = storedEventSchema.safeParse(row.event);
    const recorded = z.array(duplicateSchema).safeParse(row.duplicate_matches);
    return { ...row, duplicate_matches: [...(recorded.success ? recorded.data : []), ...(parsed.success ? fixtureDuplicates(parsed.data, events) : [])] };
  });
});
export const moderateEvent = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(v => moderationSchema.parse(v)).handler(async ({ data, context }) => {
  const { data: admin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (!admin) throw new Error('Administrator access required');
  const { error } = await context.supabase.rpc('moderate_event', { record_id: data.id, action: data.action, reason: data.reason });
  if (error) throw new Error(error.code === '23505' ? 'An official URL is already used by a published event. Resolve the duplicate before publishing.' : 'Review was not saved. The event may be expired; try again.');
  return { ok: true };
});
export const updateEventLink = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(v => z.object({ id: z.string().uuid(), registrationUrl: z.string().trim().max(2048).default(''), registrationDeadline: z.string().trim().max(10).default('') }).parse(v)).handler(async ({ data, context }) => {
  const { data: admin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (!admin) throw new Error('Administrator access required');
  if (data.registrationUrl && !/^https?:\/\/\S+$/.test(data.registrationUrl)) throw new Error('Enter a valid URL starting with http:// or https://');
  if (data.registrationDeadline && !/^\d{4}-\d{2}-\d{2}$/.test(data.registrationDeadline)) throw new Error('Enter a valid deadline date');
  const { error } = await context.supabase.rpc('update_event_registration', { record_id: data.id, registration_url: data.registrationUrl, registration_deadline: data.registrationDeadline });
  if (error) throw new Error(error.code === '23505' ? 'That URL is already used by another published event.' : 'Could not save the registration link. Check the URL and deadline, then try again.');
  return { ok: true };
});
export const myAdminStatus = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: admin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  return { admin: admin === true };
});