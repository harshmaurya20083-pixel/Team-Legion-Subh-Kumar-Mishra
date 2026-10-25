// One information item, in three visual sizes so the feed doesn't look repetitive.
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { InfoItem } from "@/data/types";
import { formatDate } from "@/lib/filters";
import { CategoryLabel, SampleBadge, SaveButton } from "./bits";
import { Button } from "@/components/ui/button";

type Variant = "featured" | "standard" | "row";

function Meta({ item }: { item: InfoItem }) {
  return (
    <p className="text-xs text-muted-foreground">
      {item.sourceName} · {item.contentType} · {formatDate(item.date)}
    </p>
  );
}

export function InfoCard({ item, variant = "standard" }: { item: InfoItem; variant?: Variant }) {
  const detail = (
    <Link to="/item/$id" params={{ id: item.id }} className="hover:text-primary">
      {item.title}
    </Link>
  );

  if (variant === "row") {
    return (
      <article className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b py-4 last:border-b-0">
        <div className="flex items-center gap-2">
          <CategoryLabel category={item.category} />
          {item.isSample && <SampleBadge />}
        </div>
        <SaveButton id={item.id} className="row-span-3 self-start" />
        <h3 className="font-display text-lg font-medium leading-snug">{detail}</h3>
        <Meta item={item} />
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className="relative grid gap-6 bg-foreground p-6 text-background md:grid-cols-[1.4fr_1fr] md:p-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="eyebrow text-primary-foreground/70">Featured · {item.category}</span>
            {item.isSample && (
              <span className="eyebrow border border-sample px-1.5 py-0.5 text-[0.6rem]">Sample</span>
            )}
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">{item.title}</h2>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <p className="text-base leading-relaxed text-background/80">{item.summary}</p>
          <div className="flex items-center justify-between">
            <Button asChild><Link
              to="/item/$id"
              params={{ id: item.id }}
            >
              Read details <ArrowUpRight className="h-4 w-4" />
            </Link></Button>
            <SaveButton id={item.id} className="text-background/80 hover:text-background" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card-hover flex h-full min-w-0 flex-col gap-3 rounded-md border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CategoryLabel category={item.category} />
        {item.isSample && <SampleBadge />}
      </div>
      <h3 className="font-display text-xl font-medium leading-snug">{detail}</h3>
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <Meta item={item} />
        <SaveButton id={item.id} />
      </div>
    </article>
  );
}
