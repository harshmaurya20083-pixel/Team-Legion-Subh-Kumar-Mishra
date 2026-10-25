import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Check, X, MessageSquare, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { adminQueue, moderateEvent, updateEventLink } from '@/lib/events.functions';
import { adminListCommunities, archiveCommunity, communityInputSchema, saveCommunity } from '@/lib/communities.functions';
import { moderationSchema } from '@/lib/submission';
import { CATEGORIES, PLATFORMS } from '@/data/types';
export const Route = createFileRoute('/_authenticated/admin')({ head: () => ({ meta: [{ title: 'Content moderation — MyWorld' }, { name: 'description', content: 'Restricted MyWorld event review workspace.' }, { property: 'og:title', content: 'Content moderation — MyWorld' }, { property: 'og:description', content: 'Restricted event moderation.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }), component: Admin });
function Admin() {
  const load = useServerFn(adminQueue), moderate = useServerFn(moderateEvent), updateLink = useServerFn(updateEventLink); const qc = useQueryClient();
  const queue = useQuery({ queryKey: ['admin-queue'], queryFn: () => load(), retry: false });
  const [section, setSection] = useState<'events' | 'communities'>('events');
  const [tab, setTab] = useState('pending'), [selected, setSelected] = useState<string | null>(null), [reason, setReason] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  if (queue.isPending) return <p role="status">Checking administrator access…</p>;
  if (queue.error) return <div className="space-y-5 py-8"><ShieldCheck className="size-8 text-primary" /><h1 className="text-4xl">Administrator access required</h1><p className="max-w-xl text-sm text-muted-foreground">This account cannot access moderation records. Administrator roles must be assigned by the app owner; signing up never grants admin access.</p><Button variant="outline" onClick={() => queue.refetch()}>Check access again</Button></div>;
  const rows = queue.data ?? []; const active = rows.find(r => r.id === selected);
  const displayed = rows.filter(r => tab === 'pending' ? ['pending_review', 'changes_requested'].includes(r.status) : tab === 'published' ? r.status === 'published' : ['rejected', 'archived'].includes(r.status));
  async function review(action: 'published' | 'changes_requested' | 'rejected' | 'archived') { if (!selected) return; const parsed = moderationSchema.safeParse({ id: selected, action, reason }); if (!parsed.success) { setMessage(parsed.error.issues[0]?.message ?? 'Add a reason'); return; } setBusy(true); setMessage(''); try { await moderate({ data: parsed.data }); await qc.invalidateQueries(); setSelected(null); setReason(''); setMessage(action === 'published' ? 'Event approved and published.' : 'Review saved.'); } catch(e) { setMessage(e instanceof Error ? e.message : 'Review failed'); } finally { setBusy(false); } }
  return <div className="space-y-7"><header className="border-b pb-6"><p className="eyebrow flex items-center gap-2 text-primary"><ShieldCheck className="size-4" />Restricted · Server-authorized access</p><h1 className="mt-3 text-4xl md:text-5xl">Content moderation</h1><p className="mt-3 text-sm text-muted-foreground">Human review controls publication. Approval does not claim source verification.</p><div className="mt-5 flex flex-wrap gap-2"><Button variant={section === 'events' ? 'default' : 'outline'} onClick={() => setSection('events')}><ShieldCheck />Event queues</Button><Button variant={section === 'communities' ? 'default' : 'outline'} onClick={() => setSection('communities')}><Users />Communities</Button></div></header>
    {section === 'communities' && <CommunitiesAdmin />}
    {section === 'events' && <>
    <div className="grid gap-4 sm:grid-cols-3">{[['Pending reviews', rows.filter(r => ['pending_review','changes_requested'].includes(r.status)).length], ['Published', rows.filter(r => r.status === 'published').length], ['Duplicate flags', rows.filter(r => Array.isArray(r.duplicate_matches) && r.duplicate_matches.length).length]].map(([label, count]) => <div key={label} className="rounded-md border bg-card p-5"><p className="eyebrow text-muted-foreground">{label}</p><p className="mt-3 font-mono text-3xl">{count}</p></div>)}</div><p className="text-xs text-muted-foreground">Flagged reports: not available — reporting is not enabled in this stage.</p>
    <div role="tablist" aria-label="Moderation queues" className="flex flex-wrap gap-2 border-b pb-4">{[['pending','Pending reviews'],['published','Approved / Published'],['rejected','Rejected / Archived']].map(([key,label]) => <Button key={key} role="tab" aria-selected={tab===key} variant={tab===key?'default':'outline'} onClick={() => { setTab(key ?? "pending"); setSelected(null); }}>{label}</Button>)}</div>
    {message && <p role="status" className="rounded-md border p-4 text-sm">{message}</p>}
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><section aria-label="Submissions" className="divide-y">{!displayed.length && <p className="py-8 text-sm text-muted-foreground">No submissions in this queue.</p>}{displayed.map(r => { const e=r.event as Record<string,unknown>; return <article key={r.id} className="space-y-3 py-5"><p className="eyebrow text-primary">{r.status.replaceAll('_',' ')}</p><h2 className="text-2xl">{String(e["title"])}</h2><p className="text-sm text-muted-foreground">{String(e["date"])} · {String(e["city"])} · {String(e["organizer"])}</p>{Array.isArray(r.duplicate_matches) && r.duplicate_matches.length>0 && <p className="flex gap-2 text-xs text-primary"><AlertTriangle className="size-4" />{r.duplicate_matches.length} potential duplicate match(es)</p>}<Button variant="outline" onClick={() => { setSelected(r.id); setReason(''); setMessage(''); }}>Review submission</Button></article>; })}</section>
    {active && <section aria-label="Review selected submission" className="space-y-5 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0"><h2 className="text-2xl">Review event</h2><dl className="space-y-4">{Object.entries(active.event as Record<string,unknown>).filter(([k])=>!['schedule','tags','skills','eligibility'].includes(k)).map(([k,v])=><div key={k}><dt className="eyebrow text-muted-foreground">{k.replace(/([A-Z])/g,' $1')}</dt><dd className="mt-1 break-words whitespace-pre-wrap text-sm">{String(v) || 'Not supplied'}</dd></div>)}</dl><div><p className="eyebrow text-muted-foreground">Schedule</p>{Array.isArray((active.event as Record<string,unknown>)["schedule"]) && ((active.event as Record<string,unknown>)["schedule"] as {time:string;activity:string}[]).map((s,i)=><p key={i} className="mt-2 text-sm">{s.time} · {s.activity}</p>)}</div><p className="break-all text-sm">Contact: {active.event_contacts?.contact_email ?? 'Not supplied'}</p>{Array.isArray(active.duplicate_matches) && active.duplicate_matches.length>0 && <div className="space-y-3 rounded-md border bg-accent p-4"><h3 className="text-xl">Duplicate flags</h3>{active.duplicate_matches.map((m,i)=><p key={i} className="text-sm">{String((m as Record<string,unknown>)["title"])} — {String((m as Record<string,unknown>)["reason"])}</p>)}</div>}<label className="block text-sm">Review reason / requested changes<Textarea maxLength={2000} value={reason} onChange={e=>setReason(e.target.value)} className="mt-2" /></label><div className="flex flex-wrap gap-2"><Button disabled={busy} onClick={()=>review('published')}><Check />Approve & Publish</Button><Button disabled={busy} variant="outline" onClick={()=>review('changes_requested')}><MessageSquare />Request Changes</Button><Button disabled={busy} variant="outline" onClick={()=>review('rejected')}><X />Reject</Button><Button disabled={busy} variant="outline" onClick={()=>review('archived')}>Archive</Button></div></section>}
    </div></>}</div>;
}

type CommunityRow = { id: string; name: string; platform: string; category: string; description: string; tags: unknown; audience: string; location: string; url: string; status: string };
const emptyForm = { name: '', platform: 'WhatsApp', category: 'Technology', description: '', tags: '', audience: '', location: 'Online', url: '' };

function CommunitiesAdmin() {
  const list = useServerFn(adminListCommunities), save = useServerFn(saveCommunity), archive = useServerFn(archiveCommunity); const qc = useQueryClient();
  const query = useQuery({ queryKey: ['admin-communities'], queryFn: () => list(), retry: false });
  const [form, setForm] = useState(emptyForm); const [editing, setEditing] = useState<string | null>(null); const [showForm, setShowForm] = useState(false); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const rows = (query.data ?? []) as CommunityRow[];
  function startEdit(r: CommunityRow) { setEditing(r.id); setForm({ name: r.name, platform: r.platform, category: r.category, description: r.description, tags: Array.isArray(r.tags) ? (r.tags as string[]).join(', ') : '', audience: r.audience, location: r.location, url: r.url }); setShowForm(true); setMessage(''); }
  async function submit() {
    const parsed = communityInputSchema.safeParse({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    if (!parsed.success) { setMessage(parsed.error.issues[0]?.message ?? 'Check the fields'); return; }
    setBusy(true); setMessage('');
    try { await save({ data: { id: editing ?? undefined, community: parsed.data } }); await qc.invalidateQueries(); setShowForm(false); setEditing(null); setForm(emptyForm); setMessage(editing ? 'Community updated.' : 'Community published. It now appears on the Communities page.'); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Save failed'); }
    finally { setBusy(false); }
  }
  async function remove(id: string) { setBusy(true); setMessage(''); try { await archive({ data: { id } }); await qc.invalidateQueries(); setMessage('Community archived. It no longer appears publicly.'); } catch (e) { setMessage(e instanceof Error ? e.message : 'Archive failed'); } finally { setBusy(false); } }
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="max-w-xl text-sm text-muted-foreground">Communities added here are real and visible to every visitor immediately. Only add groups you can vouch for, with their official join link.</p><Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); setMessage(''); }}><Plus />Add a community</Button></div>
    {message && <p role="status" className="rounded-md border p-4 text-sm">{message}</p>}
    {showForm && <section aria-label={editing ? 'Edit community' : 'Add community'} className="space-y-4 rounded-md border bg-card p-5">
      <h2 className="text-2xl">{editing ? 'Edit community' : 'Add a community'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">Name<Input value={form.name} maxLength={120} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-2" /></label>
        <label className="block text-sm">Location or "Online"<Input value={form.location} maxLength={120} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-2" /></label>
        <label className="block text-sm">Platform<select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className="mt-2 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">{PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}</select></label>
        <label className="block text-sm">Topic<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-2 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
        <label className="block text-sm">Audience (optional)<Input value={form.audience} maxLength={120} placeholder="e.g. Final-year students" onChange={e => setForm({ ...form, audience: e.target.value })} className="mt-2" /></label>
        <label className="block text-sm">Join link (optional)<Input value={form.url} maxLength={500} placeholder="https://chat.whatsapp.com/…" onChange={e => setForm({ ...form, url: e.target.value })} className="mt-2" /></label>
      </div>
      <label className="block text-sm">Description<Textarea value={form.description} maxLength={2000} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-2" /></label>
      <label className="block text-sm">Tags, separated by commas<Input value={form.tags} placeholder="hackathon, teams" onChange={e => setForm({ ...form, tags: e.target.value })} className="mt-2" /></label>
      <div className="flex flex-wrap gap-2"><Button disabled={busy} onClick={submit}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Publish community'}</Button><Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button></div>
    </section>}
    <section aria-label="Added communities" className="divide-y">
      {query.isPending && <p role="status">Loading communities…</p>}
      {!query.isPending && !rows.length && <p className="py-8 text-sm text-muted-foreground">No communities added yet. The public page currently shows only the example listings.</p>}
      {rows.map(r => <article key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div><p className="eyebrow text-primary">{r.status}{r.status === 'archived' ? ' · hidden from public' : ''}</p><h3 className="text-xl">{r.name}</h3><p className="text-sm text-muted-foreground">{r.platform} · {r.category}{r.url ? ' · join link set' : ' · no join link'}</p></div>
        <div className="flex gap-2"><Button variant="outline" onClick={() => startEdit(r)}>Edit</Button>{r.status !== 'archived' && <Button variant="outline" disabled={busy} onClick={() => remove(r.id)}>Archive</Button>}</div>
      </article>)}
    </section>
  </div>;
}