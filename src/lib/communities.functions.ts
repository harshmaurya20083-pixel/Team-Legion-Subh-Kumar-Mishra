import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { communities } from '@/data/communities';
import { CATEGORIES, PLATFORMS, type Community } from '@/data/types';
import type { Database } from '@/integrations/supabase/types';

const JOIN_URL_PATTERN = /^https:\/\/(chat\.whatsapp\.com\/|wa\.me\/|discord\.gg\/|discord\.com\/invite\/|t\.me\/|reddit\.com\/r\/)/;

export const communityInputSchema = z.object({
  name: z.string().trim().min(2, 'Name needs at least 2 characters').max(120),
  platform: z.enum(PLATFORMS),
  category: z.enum(CATEGORIES),
  description: z.string().trim().min(10, 'Describe the community in at least 10 characters').max(2000),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  audience: z.string().trim().max(120),
  location: z.string().trim().max(120),
  url: z.string().trim().max(500).refine(u => u === '' || JOIN_URL_PATTERN.test(u), 'Join link must be an official WhatsApp, Discord, Telegram or Reddit URL'),
});
export type CommunityInput = z.infer<typeof communityInputSchema>;

async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data: admin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (!admin) throw new Error('Administrator access required');
}

export const listPublishedCommunities = createServerFn({ method: 'GET' }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error('Community service is unavailable');
  const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization'); h.set('apikey', key); return fetch(input, { ...init, headers: h }); } } });
  const result: Community[] = [...communities];
  const { data, error } = await client.from('community_records').select('id,name,platform,category,description,tags,audience,location,url').eq('status', 'published').order('created_at');
  if (error) throw new Error('Unable to load communities');
  for (const row of data ?? []) {
    const tags = z.array(z.string()).safeParse(row.tags);
    result.push({ id: `comm-${row.id}`, name: row.name, platform: row.platform as Community['platform'], category: row.category as Community['category'], description: row.description, tags: tags.success ? tags.data : [], audience: row.audience || undefined, location: row.location || undefined, url: row.url || undefined, isSample: false });
  }
  return result;
});

export const adminListCommunities = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  await requireAdmin(context);
  const { data, error } = await context.supabase.from('community_records').select('*').order('created_at', { ascending: false });
  if (error) throw new Error('Could not load communities');
  return data ?? [];
});

export const saveCommunity = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(v => z.object({ id: z.string().uuid().optional(), community: communityInputSchema }).parse(v)).handler(async ({ data, context }) => {
  await requireAdmin(context);
  const row = { ...data.community, created_by: context.userId };
  const query = data.id
    ? context.supabase.from('community_records').update(row).eq('id', data.id)
    : context.supabase.from('community_records').insert(row);
  const { error } = await query;
  if (error) throw new Error('Community could not be saved. Check the fields and try again.');
  return { ok: true };
});

export const archiveCommunity = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(v => z.object({ id: z.string().uuid() }).parse(v)).handler(async ({ data, context }) => {
  await requireAdmin(context);
  const { error } = await context.supabase.from('community_records').update({ status: 'archived' }).eq('id', data.id);
  if (error) throw new Error('Community could not be archived');
  return { ok: true };
});
