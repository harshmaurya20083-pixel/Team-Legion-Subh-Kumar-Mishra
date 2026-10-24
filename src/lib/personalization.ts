import { z } from 'zod';
import type { DiscoveryEvent } from '@/data/types';
import { EVENT_CATEGORIES, EVENT_FORMATS } from '@/data/types';
export const preferencesSchema = z.object({ interests: z.array(z.string().trim().min(1).max(100)).max(30), location: z.string().trim().max(100), categories: z.array(z.enum(EVENT_CATEGORIES)).max(5), formats: z.array(z.enum(EVENT_FORMATS)).max(3), from: z.string().max(10), until: z.string().max(10), internshipRoles: z.array(z.string().trim().min(1).max(100)).max(20), workFormats: z.array(z.enum(['In-person','Remote','Hybrid'])).max(3) }).superRefine((v,c) => { for(const k of ['from','until'] as const) if(v[k] && (!/^\d{4}-\d{2}-\d{2}$/.test(v[k]) || Number.isNaN(Date.parse(v[k])) || new Date(v[k]).toISOString().slice(0,10)!==v[k])) c.addIssue({ code:'custom',path:[k],message:'Choose a valid date' }); if(v.from && v.until && v.from>v.until)c.addIssue({code:'custom',path:['until'],message:'End date must follow start date'}); });
export type Preferences = z.infer<typeof preferencesSchema>;
export const defaultPreferences: Preferences = { interests:[],location:'',categories:[],formats:[],from:'',until:'',internshipRoles:[],workFormats:[] };
export const markSchema = z.object({ kind:z.enum(['saved','follow','checklist']), id:z.string().min(1).max(200).regex(/^[a-zA-Z0-9:_-]+$/), enabled:z.boolean() });
export type Mark = { kind:'saved'|'follow'|'checklist'; id:string };
export function recommendEvents(events: DiscoveryEvent[], prefs: Preferences, today: string) {
  return events.filter(e=>e.status==='published' && e.reviewStatus==='approved' && e.endDate>=today).map(event=>{
    const reasons:string[]=[]; const hay=[event.title,event.description,...event.skills,...event.tags].join(' ').toLowerCase();
    prefs.interests.filter(i=>hay.includes(i.toLowerCase())).forEach(i=>reasons.push(`Matches your interest in ${i}`));
    if(prefs.location && [event.city,event.campus].some(v=>v.toLowerCase().includes(prefs.location.toLowerCase())))reasons.push('Within your selected location');
    if(prefs.categories.includes(event.category))reasons.push(`Matches your ${event.category.toLowerCase()} preference`);
    if(prefs.formats.includes(event.format))reasons.push(`Matches your ${event.format==='Offline'?'in-person':event.format.toLowerCase()} format preference`);
    if((prefs.from||prefs.until) && (!prefs.from||event.date>=prefs.from) && (!prefs.until||event.date<=prefs.until))reasons.push('Within your selected dates');
    return {event,reasons};
  }).filter(r=>r.reasons.length).sort((a,b)=>b.reasons.length-a.reasons.length||a.event.date.localeCompare(b.event.date)||a.event.id.localeCompare(b.event.id));
}
export function followedEvents(events: DiscoveryEvent[], followed: string[], today:string) { return events.filter(e=>e.status==='published'&&e.reviewStatus==='approved'&&e.endDate>=today&&e.communityId&&followed.includes(e.communityId)).sort((a,b)=>a.date.localeCompare(b.date)); }