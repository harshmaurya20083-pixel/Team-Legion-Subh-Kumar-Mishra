// A single community in the directory. The Join button only works when a real link exists.
import { useRef, useState } from "react";
import { Check, Copy, ExternalLink, MapPin, MessageCircle, UserPlus, UserCheck } from "lucide-react";
import type { Community } from "@/data/types";
import { isValidUrl } from "@/lib/filters";
import { CategoryLabel } from "./bits";
import { Button } from "@/components/ui/button";
import { usePersonal } from '@/lib/personal';

function isWhatsAppLink(url: string) {
  return /^https:\/\/(chat\.whatsapp\.com|wa\.me|whatsapp\.com)\//i.test(url);
}

export function CommunityCard({ community }: { community: Community }) {
  const {state,toggle,ready,busy}=usePersonal();
  const [copied,setCopied]=useState(false);
  const copyTimer=useRef<number|undefined>(undefined);
  const copyLink=async()=>{
    const url=community.url;
    if(!url) return;
    try{
      await navigator.clipboard.writeText(url);
    }catch{
      // Fallback for browsers/contexts without the async clipboard API.
      const ta=document.createElement('textarea');
      ta.value=community.url;
      ta.setAttribute('readonly','');
      ta.style.position='fixed';
      ta.style.opacity='0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current=window.setTimeout(()=>setCopied(false),2000);
  };
  const followed=state.marks.some(m=>m.kind==='follow'&&m.id===community.id);
  const hasLink = isValidUrl(community.url);
  return (
    <article className="card-hover flex h-full min-w-0 flex-col gap-3 rounded-md border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium">{community.platform}</span>
      </div>
      <h3 className="font-display text-xl font-medium leading-snug">{community.name}</h3>
      <CategoryLabel category={community.category} />
      <p className="text-sm leading-relaxed text-muted-foreground">{community.description}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {community.audience && <span>For: {community.audience}</span>}
        {community.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {community.location}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {community.tags.map((t) => (
          <span key={t} className="bg-secondary px-1.5 py-0.5 font-mono text-[11px]">#{t}</span>
        ))}
      </div>
      <div className="mt-auto pt-3">
        <Button className="mb-3" variant={followed?'secondary':'outline'} aria-pressed={followed} disabled={!ready||busy} onClick={()=>toggle('follow',community.id)}>{followed?<UserCheck />:<UserPlus />}{followed?'Following':'Follow community'}</Button>
        {hasLink ? (
          isWhatsAppLink(community.url!) ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild><a
                href={community.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join on WhatsApp <MessageCircle className="h-3.5 w-3.5" />
              </a></Button>
              <Button variant="outline" onClick={copyLink} aria-label="Copy WhatsApp invite link">
                {copied?<Check className="h-3.5 w-3.5" />:<Copy className="h-3.5 w-3.5" />}{copied?'Copied':'Copy link'}
              </Button>
              {copied && <span className="text-xs text-muted-foreground">Invite link copied — paste it into WhatsApp or a browser.</span>}
            </div>
          ) : (
            <Button asChild><a
              href={community.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit community <ExternalLink className="h-3.5 w-3.5" />
            </a></Button>
          )
        ) : (
          <div>
            <Button variant="outline" disabled>
              Link unavailable
            </Button>
            <p className="mt-1.5 text-xs text-muted-foreground">
              No invite link has been added yet.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
