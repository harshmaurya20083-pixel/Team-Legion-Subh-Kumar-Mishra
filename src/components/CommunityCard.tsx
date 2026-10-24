// A single community in the directory. The Join button only works when a real link exists.
import { ExternalLink, MapPin } from "lucide-react";
import type { Community } from "@/data/types";
import { isValidUrl } from "@/lib/filters";
import { CategoryLabel, SampleBadge } from "./bits";
import { Button } from "@/components/ui/button";

export function CommunityCard({ community }: { community: Community }) {
  const hasLink = isValidUrl(community.url);
  return (
    <article className="flex h-full min-w-0 flex-col gap-3 rounded-md border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium">{community.platform}</span>
        {community.isSample && <SampleBadge />}
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
        {hasLink ? (
          <Button asChild><a
            href={community.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit community <ExternalLink className="h-3.5 w-3.5" />
          </a></Button>
        ) : (
          <div>
            <Button variant="outline" disabled>
              Link unavailable
            </Button>
            <p className="mt-1.5 text-xs text-muted-foreground">
              This is a sample community — no real invite link exists yet.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
