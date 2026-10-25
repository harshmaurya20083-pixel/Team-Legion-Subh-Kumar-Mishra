// Small shared building blocks used across cards and pages.
import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { Category } from "@/data/types";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CATEGORY_DOT: Record<Category, string> = {
  Technology: "bg-cat-technology",
  Education: "bg-cat-education",
  Careers: "bg-cat-careers",
  Business: "bg-cat-business",
  Local: "bg-cat-local",
  Culture: "bg-cat-culture",
  "General News": "bg-cat-news",
};

export function CategoryLabel({ category }: { category: Category }) {
  return (
    <span className="eyebrow inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full", CATEGORY_DOT[category])} />
      {category}
    </span>
  );
}

export function SaveButton({ id, className }: { id: string; className?: string }) {
  const { isSaved, toggleSaved, ready, busy } = useSaved();
  const saved = isSaved(id);
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={() => toggleSaved(id)}
      disabled={!ready || busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save item"}
      className={cn(
        "h-9 shrink-0 gap-1.5 px-2 text-xs font-medium",
        saved ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <Icon className={cn("h-4 w-4 transition-transform", saved && "scale-110")} />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-foreground pb-2">
      <div>
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed px-6 py-16 text-center">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function PrimaryLink({ to, children }: { to: "/explore" | "/communities" | "/"; children: ReactNode }) {
  return (
    <Button asChild><Link to={to}>
      {children}
    </Link></Button>
  );
}
