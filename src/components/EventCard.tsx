import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { DiscoveryEvent } from "@/data/types";
import { formatDate } from "@/lib/filters";
import { SampleBadge, SaveButton } from "./bits";
import workshopImage from "@/assets/student-workshop.jpg";

export function EventCard({ event }: { event: DiscoveryEvent }) {
  return (
    <article className="card-hover flex min-w-0 flex-col rounded-md border bg-card">
      {event.id === "event-austin-build" && <figure><img src={workshopImage} alt="Illustrative student workshop, not the sample event" loading="lazy" width={1536} height={1024} className="aspect-[2/1] w-full rounded-t-md object-cover" /><figcaption className="px-5 pt-2 text-[10px] text-muted-foreground">Illustrative image</figcaption></figure>}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="eyebrow text-primary">{event.category} · {event.format}</span>{event.isSample && <SampleBadge />}</div>
        <h2 className="text-2xl font-medium leading-tight"><Link to="/events/$id" params={{ id: event.id }} className="hover:text-primary">{event.title}</Link></h2>
        <p className="text-xs text-muted-foreground">By {event.organizer}</p>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
        <div className="mt-auto space-y-2 pt-2 text-xs"><p className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0 text-primary" />{formatDate(event.date)}</p><p className="flex items-start gap-2"><MapPin className="size-4 shrink-0 text-muted-foreground" /><span>{event.city} · {event.campus}</span></p></div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3"><Link to="/events/$id" params={{ id: event.id }} className="inline-flex min-h-9 items-center gap-1 text-sm text-primary">View details<ArrowUpRight className="size-4" /></Link><SaveButton id={event.id} /></div>
      </div>
    </article>
  );
}