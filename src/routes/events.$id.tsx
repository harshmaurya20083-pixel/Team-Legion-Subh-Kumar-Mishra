import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { publicEventsOptions, usePublicEvents } from "@/lib/event-query";
import { Button } from "@/components/ui/button";
import { SampleBadge, SaveButton, EmptyState } from "@/components/bits";
import { canRegister, formatDate, isValidUrl } from "@/lib/filters";
import { EventCard } from "@/components/EventCard";
import workshopImage from "@/assets/student-workshop.jpg";

export const Route = createFileRoute("/events/$id")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicEventsOptions),
  head: ({ params, loaderData }) => {
    const event = loaderData?.find((item) => item.id === params.id && item.status === "published" && item.reviewStatus === "approved");
    const title = event ? `${event.title}${event.isSample ? " (Sample)" : ""} — MyWorld` : "Event unavailable — MyWorld";
    const description = event?.description ?? "This event is unavailable. Explore other MyWorld events.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, ...(!event ? [{ name: "robots", content: "noindex" }] : [])] };
  },
  component: EventDetails,
});

function EventDetails() {
  const events = usePublicEvents();
  const { id } = Route.useParams();
  const event = events.find((item) => item.id === id && item.status === "published" && item.reviewStatus === "approved");
  if (!event) return <EmptyState title="Event unavailable" body="This event may no longer be available." action={<Button asChild><Link to="/explore">Explore Events</Link></Button>} />;
  const related = events.filter(e=>e.id!==event.id&&e.organizer===event.organizer&&e.endDate>=new Date().toISOString().slice(0,10));
  const register = canRegister(event, new Date().toISOString().slice(0, 10));
  return (
    <div className="space-y-8">
      <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-primary"><ArrowLeft className="size-4" />Explore Events</Link>
      <header className="space-y-4 border-b pb-7">
        <div className="flex flex-wrap items-center gap-3"><span className="eyebrow text-primary">{event.category} · {event.format}</span>{event.isSample && <SampleBadge />}</div>
        <h1 className="max-w-3xl text-4xl font-semibold md:text-5xl">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-2"><CalendarDays className="size-4" />{formatDate(event.date)}{event.endDate !== event.date && ` – ${formatDate(event.endDate)}`}</span><span className="flex items-center gap-2"><MapPin className="size-4" />{event.city} · {event.campus}</span></div>
        <SaveButton id={event.id} />
      </header>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-8">
          {event.id === "event-austin-build" && <figure><img src={workshopImage} alt="Illustrative students building a project together in a workshop" width={1536} height={1024} className="aspect-[3/2] w-full rounded-md object-cover" /><figcaption className="mt-2 text-xs text-muted-foreground">Illustrative image · not a photograph of this sample event</figcaption></figure>}
          <section><h2 className="mb-3 text-2xl font-semibold">About the event</h2><p className="leading-relaxed text-muted-foreground">{event.description}</p></section>
          <section><h2 className="mb-2 text-2xl font-semibold">Schedule</h2><p className="mb-4 text-xs text-muted-foreground">Local times · {event.timeZone}</p><ol className="divide-y border-y">{event.schedule.map((entry) => <li key={entry.time} className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]"><span className="font-mono text-xs text-primary">{entry.time}</span><span className="text-sm">{entry.activity}</span></li>)}</ol></section>
          <section><h2 className="mb-3 text-2xl font-semibold">Venue & access</h2><p className="text-sm">{event.venue}</p><p className="mt-2 text-sm text-muted-foreground">{event.campus} · {event.city}</p>{event.onlineDetails && <p className="mt-3 text-sm text-muted-foreground">{event.onlineDetails}</p>}</section>
          <section><h2 className="mb-3 text-2xl font-semibold">Eligibility</h2><p className="text-sm leading-relaxed text-muted-foreground">{event.eligibilityDetails}</p></section>
          <section><h2 className="mb-3 text-2xl font-semibold">Skills & topics</h2><p className="text-sm leading-relaxed text-muted-foreground">{event.skillsDetails}</p><div className="mt-3 flex flex-wrap gap-2">{event.skills.map((skill) => <span key={skill} className="rounded-sm bg-secondary px-2 py-1 text-xs">{skill}</span>)}</div></section>
          <section><h2 className="mb-3 text-2xl font-semibold">Organizer</h2><p className="flex items-center gap-2 text-sm font-medium"><Users className="size-4" />{event.organizer}</p><p className="mt-2 text-sm text-muted-foreground">{event.organizerDescription}</p>{event.communityId && <Link to="/communities" className="mt-3 inline-block text-sm text-primary">Browse communities</Link>}</section>
          <div className="flex flex-wrap gap-2">{event.tags.map((tag) => <span className="font-mono text-xs text-muted-foreground" key={tag}>#{tag}</span>)}</div>
        </div>
        <aside className="space-y-5 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <h2 className="text-2xl font-semibold">Registration</h2>
          <p className="text-sm">{event.registrationDeadline ? `Deadline: ${formatDate(event.registrationDeadline)}` : "No deadline supplied"}</p>
          {register ? <Button asChild className="w-full"><a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">Register<ArrowUpRight /></a></Button> : <Button disabled className="w-full">Registration unavailable</Button>}
          <p className="text-sm leading-relaxed text-muted-foreground">{event.isSample ? "This is a sample event. Registration and official links are disabled." : register ? "Registration opens on the supplied official website. Check the organizer’s requirements before registering." : "Registration is closed or no valid official registration link has been supplied."}</p>
          <div className="border-t pt-5"><p className="eyebrow mb-2 text-muted-foreground">Source</p><p className="text-sm">{event.sourceName}</p><p className="mt-2 text-xs text-muted-foreground">Updated {formatDate(event.updatedAt)}</p>{!event.isSample && isValidUrl(event.sourceUrl) && <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-primary">Official event source</a>}</div>
        </aside>
      </div>
      {related.length>0&&<section className="border-t pt-6"><h2 className="mb-5 text-2xl">More from {event.organizer}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(e=><EventCard key={e.id} event={e}/>)}</div></section>}
    </div>
  );
}