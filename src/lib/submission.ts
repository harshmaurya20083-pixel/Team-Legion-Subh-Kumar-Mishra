import { z } from 'zod';
import { EVENT_CATEGORIES, EVENT_FORMATS, type DiscoveryEvent } from '@/data/types';
const text = (max: number) => z.string().trim().min(1, 'This field is required').max(max);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date').refine(v => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v, 'Invalid date');
const url = z.string().trim().max(2048).refine(v => { if (!v) return true; try { const u = new URL(v); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password && !/\s/.test(v); } catch { return false; } }, 'Enter a valid http or https URL');
export const submissionSchema = z.object({
  title: text(160), description: text(10000), category: z.enum(EVENT_CATEGORIES), format: z.enum(EVENT_FORMATS),
  organizer: text(160), organizerDescription: text(2000), date, endDate: date, registrationDeadline: date,
  city: text(100), campus: text(200), venue: text(500), timeZone: text(100), onlineDetails: z.string().max(2000),
  eligibilityDetails: text(2000), skillsDetails: text(2000), skillsText: z.string().max(1000), tagsText: z.string().max(1000),
  scheduleText: text(3000), sourceName: text(200), sourceUrl: url, registrationUrl: url,
  contactEmail: z.string().trim().email('Enter a valid email').max(255), isSample: z.boolean(),
}).superRefine((v, ctx) => {
  if (v.endDate < v.date) ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'End date must be on or after the event date' });
  if (v.registrationDeadline > v.date) ctx.addIssue({ code: 'custom', path: ['registrationDeadline'], message: 'Deadline must be on or before the event date' });
  if (v.date < new Date().toISOString().slice(0, 10)) ctx.addIssue({ code: 'custom', path: ['date'], message: 'Choose today or a future date' });
  for (const key of ['skillsText', 'tagsText'] as const) if (v[key].split(',').filter(s => s.trim()).length > 30) ctx.addIssue({ code: 'custom', path: [key], message: 'Use no more than 30 entries' });
  if (v.scheduleText.split('\n').filter(s => s.trim()).length > 30) ctx.addIssue({ code: 'custom', path: ['scheduleText'], message: 'Use no more than 30 schedule entries' });
});
export type SubmissionInput = z.infer<typeof submissionSchema>;
export const duplicateSchema = z.object({ id: z.string(), title: z.string(), date: z.string(), city: z.string(), published: z.boolean(), reason: z.string() });
export type Duplicate = z.infer<typeof duplicateSchema>;
export const normalizeTitle = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export const normalizeUrl = (v?: string) => (v ?? '').trim().split('#')[0]?.replace(/\/$/, '') ?? '';
export function fixtureDuplicates(input: SubmissionInput, fixtures: DiscoveryEvent[]): Duplicate[] {
  return fixtures.flatMap(e => {
    const urlMatch = [input.sourceUrl, input.registrationUrl].some(a => Boolean(normalizeUrl(a)) && [e.sourceUrl, e.registrationUrl].some(b => normalizeUrl(a) === normalizeUrl(b)));
    const a = normalizeTitle(input.title), b = normalizeTitle(e.title);
    const titleMatch = a === b || (a.length >= 10 && (a.includes(b) || b.includes(a)));
    const details = normalizeTitle(input.organizer) === normalizeTitle(e.organizer) && input.date === e.date && normalizeTitle(input.city) === normalizeTitle(e.city);
    return urlMatch || (titleMatch && details) ? [{ id: e.id, title: e.title, date: e.date, city: e.city, published: true, reason: urlMatch ? 'Exact official or registration URL' : 'Similar title, same organizer, date and city' }] : [];
  });
}
export function eventPayload(v: SubmissionInput) {
  return { title: v.title, description: v.description, category: v.category, format: v.format, organizer: v.organizer, organizerDescription: v.organizerDescription, date: v.date, endDate: v.endDate, registrationDeadline: v.registrationDeadline, city: v.city, campus: v.campus, venue: v.venue, timeZone: v.timeZone, onlineDetails: v.onlineDetails, eligibility: [v.eligibilityDetails], eligibilityDetails: v.eligibilityDetails, skillsDetails: v.skillsDetails, skills: v.skillsText.split(',').map(s => s.trim()).filter(Boolean), tags: v.tagsText.split(',').map(s => s.trim()).filter(Boolean), schedule: v.scheduleText.split('\n').filter(s => s.trim()).map(s => { const [time, ...activity] = s.split('|'); return { time: time?.trim() ?? '', activity: activity.join('|').trim() || 'Event session' }; }), sourceName: v.sourceName, sourceUrl: v.sourceUrl, registrationUrl: v.registrationUrl, isSample: v.isSample };
}
export const moderationSchema = z.object({ id: z.string().uuid(), action: z.enum(['published', 'changes_requested', 'rejected', 'archived']), reason: z.string().trim().max(2000) }).refine(v => v.action === 'published' || v.reason.length >= 3, { path: ['reason'], message: 'Add a reason (at least 3 characters)' });