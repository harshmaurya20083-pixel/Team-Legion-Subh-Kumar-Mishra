import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { InfoCard } from "@/components/InfoCard";
import { CategoryLabel, SaveButton } from "@/components/bits";
import { informationItems } from "@/data/information";
import { formatDate, isValidUrl } from "@/lib/filters";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => {
    const item = informationItems.find((i) => i.id === params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.title} — MyWorld` },
          { name: "description", content: loaderData.item.summary },
          { property: "og:title", content: loaderData.item.title },
          { property: "og:description", content: loaderData.item.summary },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary" },
        ]
      : [{ title: "Item not found — MyWorld" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-semibold">This item doesn't exist</h1>
      <Link to="/resources" className="mt-4 inline-block text-primary hover:underline">Back to Resources</Link>
    </div>
  ),
  component: ItemDetail,
});

function ItemDetail() {
  const { item } = Route.useLoaderData();
  const related = informationItems.filter((i) => i.category === item.category && i.id !== item.id).slice(0, 3);

  return (
    <div className="space-y-12">
      <Link to="/resources" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Resources
      </Link>
      <article className="max-w-3xl space-y-5">
        <div className="flex items-center gap-3">
          <CategoryLabel category={item.category} />
         </div>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{item.title}</h1>
        <p className="text-sm text-muted-foreground">
          {item.sourceName} ({item.sourceType}) · {item.contentType} · {formatDate(item.date)}
        </p>
        <p className="text-lg leading-relaxed">{item.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span key={t} className="bg-secondary px-1.5 py-0.5 font-mono text-xs">#{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-5 border-t pt-5">
          <SaveButton id={item.id} className="text-sm" />
          {isValidUrl(item.url) ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Open source <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">No external link has been supplied.</span>
          )}
          <Link to="/resources" search={{ category: item.category }} className="text-sm text-primary hover:underline">
            More in {item.category}
          </Link>
        </div>
      </article>
      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Related</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((r) => <InfoCard key={r.id} item={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
