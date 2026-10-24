import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness } from "lucide-react";
import { InfoCard } from "@/components/InfoCard";
import { EmptyState } from "@/components/bits";
import { informationItems } from "@/data/information";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: "Internship Opportunities — MyWorld" },
      { name: "description", content: "Explore MyWorld's clearly labelled sample internship opportunities. The application preparation guide is planned for a later stage." },
      { property: "og:title", content: "Internship Opportunities — MyWorld" },
      { property: "og:description", content: "A separate space for student internship opportunities, starting with clearly labelled sample listings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Internships,
});

function Internships() {
  const items = informationItems.filter((item) => item.contentType === "Opportunities" && /internship/i.test(`${item.title} ${item.tags.join(" ")}`));
  return (
    <div className="space-y-8">
      <header className="max-w-2xl border-b pb-7">
        <p className="eyebrow flex items-center gap-2 text-primary"><BriefcaseBusiness className="size-4" /> Student opportunities</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Internship Opportunities</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">Sample listings only — these are not live vacancies. Employer requirements, preparation resources and application checklists will be added in a later stage.</p>
      </header>
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <InfoCard key={item.id} item={item} />)}</div>
      ) : <EmptyState title="No internship listings yet" body="Internship opportunities will appear here when available." />}
    </div>
  );
}