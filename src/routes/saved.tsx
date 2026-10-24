import { createFileRoute } from "@tanstack/react-router";
import { InfoCard } from "@/components/InfoCard";
import { EmptyState, PrimaryLink } from "@/components/bits";
import { informationItems } from "@/data/information";
import { useSaved } from "@/lib/saved";
import { publicEventsOptions, usePublicEvents } from "@/lib/event-query";
import { EventCard } from "@/components/EventCard";
import { internships } from "@/data/internships";
import { InternshipCard } from "@/components/InternshipCard";
import { useAccount } from "@/lib/account";

export const Route = createFileRoute("/saved")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicEventsOptions),
  head: () => ({
    meta: [
      { title: "Saved — MyWorld" },
      { name: "description", content: "Items you've saved on MyWorld to read later." },
      { property: "og:title", content: "Saved — MyWorld" },
      { property: "og:description", content: "Your saved reading list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Saved,
});

function Saved() {
  const events = usePublicEvents();
  const { savedIds, ready } = useSaved();
  const {user}=useAccount();
  const savedInternships=internships.filter(i=>savedIds.includes(i.id));
  const items = informationItems.filter((i) => savedIds.includes(i.id));
  const savedEvents = events.filter((event) => savedIds.includes(event.id) && event.status === "published" && event.reviewStatus === "approved");

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-primary">Your shelf</p>
        <h1 className="text-4xl font-semibold md:text-5xl">Saved for later</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user ? "Saved to your account." : "Stored in this browser. Sign in to sync saves to your account."}</p>
      </header>
      {!ready ? <p role="status">Loading saved items…</p> : items.length === 0 && savedEvents.length === 0 && savedInternships.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          body="Tap Save on anything in your feed or in Explore and it will show up here."
          action={<PrimaryLink to="/explore">Go to Explore</PrimaryLink>}
        />
      ) : (
        <div className="space-y-10">
          {savedInternships.length>0&&<section><h2 className="mb-5 text-2xl">Saved internships</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{savedInternships.map(i=><InternshipCard key={i.id} item={i}/>)}</div></section>}
          {savedEvents.length > 0 && <section><h2 className="mb-5 text-2xl font-semibold">Saved events</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{savedEvents.map((event) => <EventCard key={event.id} event={event} />)}</div></section>}
          {items.length > 0 && <section><h2 className="mb-5 text-2xl font-semibold">Resources & opportunities</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <InfoCard key={item.id} item={item} />
          ))}
          </div></section>}
        </div>
      )}
    </div>
  );
}
