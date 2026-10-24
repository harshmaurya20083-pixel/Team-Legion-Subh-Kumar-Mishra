import { createFileRoute } from "@tanstack/react-router";
import { InfoCard } from "@/components/InfoCard";
import { EmptyState, PrimaryLink } from "@/components/bits";
import { informationItems } from "@/data/information";
import { useSaved } from "@/lib/saved";

export const Route = createFileRoute("/saved")({
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
  const { savedIds } = useSaved();
  const items = informationItems.filter((i) => savedIds.includes(i.id));

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-primary">Your shelf</p>
        <h1 className="text-4xl font-semibold md:text-5xl">Saved for later</h1>
        <p className="mt-2 text-sm text-muted-foreground">Stored in this browser only.</p>
      </header>
      {items.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          body="Tap Save on anything in your feed or in Explore and it will show up here."
          action={<PrimaryLink to="/explore">Go to Explore</PrimaryLink>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <InfoCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
