import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { defaultPreferences, markSchema, preferencesSchema } from './personalization';
import { z } from 'zod';
export const loadPersonal = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
  const [p,m]=await Promise.all([context.supabase.from('user_preferences').select('*').eq('user_id',context.userId).maybeSingle(),context.supabase.from('user_marks').select('kind,item_id').eq('user_id',context.userId)]);
  if(p.error||m.error)throw new Error('Could not load your preferences and saved items.');
  const r=p.data; return {preferences:r?preferencesSchema.parse({interests:r.interests,location:r.location,categories:r.categories,formats:r.formats,from:r.date_from,until:r.date_until,internshipRoles:r.internship_roles,workFormats:r.work_formats}):defaultPreferences,marks:z.array(z.object({kind:z.enum(['saved','follow','checklist']),id:z.string()})).parse((m.data??[]).map(v=>({kind:v.kind,id:v.item_id})))};
});
export const savePreferences=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(v=>preferencesSchema.parse(v)).handler(async({data,context})=>{
  const {error}=await context.supabase.from('user_preferences').upsert({user_id:context.userId,interests:data.interests,location:data.location,categories:data.categories,formats:data.formats,date_from:data.from,date_until:data.until,internship_roles:data.internshipRoles,work_formats:data.workFormats}); if(error)throw new Error('Preferences were not saved. Please try again.'); return data;
});
export const setPersonalMark=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(v=>markSchema.parse(v)).handler(async({data,context})=>{
  const result=data.enabled?await context.supabase.from('user_marks').upsert({user_id:context.userId,kind:data.kind,item_id:data.id},{onConflict:'user_id,kind,item_id',ignoreDuplicates:true}):await context.supabase.from('user_marks').delete().eq('user_id',context.userId).eq('kind',data.kind).eq('item_id',data.id);
  if(result.error)throw new Error('Your change was not saved. Please try again.'); return {ok:true};
});