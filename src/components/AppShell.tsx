// The app frame: navigation rail on desktop, top bar + bottom tabs on mobile.
import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, BriefcaseBusiness, Compass, Home, Menu, Search, SlidersHorizontal, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useSaved } from "@/lib/saved";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore Events", icon: Compass },
  { to: "/communities", label: "Communities", icon: Users },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/internships", label: "Internship Opportunities", icon: BriefcaseBusiness },
  { to: "/preferences", label: "Preferences", icon: SlidersHorizontal },
] as const;

function Wordmark() {
  return (
    <Link to="/" className="font-display text-3xl font-semibold">
      My<span className="italic text-primary">World</span>
    </Link>
  );
}

function QuickSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/explore", search: { q: q.trim() || undefined } });
      }}
      className="flex items-center gap-2 border-b border-foreground/30 py-1.5 focus-within:border-primary"
    >
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search MyWorld"
        aria-label="Search MyWorld"
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </form>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { savedIds } = useSaved();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 overflow-y-auto border-r px-5 py-8 md:flex">
        <div><Wordmark /><p className="eyebrow mt-2 text-muted-foreground">Events · People · Possibilities</p></div>
        <QuickSearch />
        <nav aria-label="Main navigation" className="flex flex-col gap-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group flex min-h-11 items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:border-primary data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-primary"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {to === "/saved" && savedIds.length > 0 && (
                <span className="font-mono text-xs text-primary">{savedIds.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <p className="mt-auto text-xs leading-relaxed text-muted-foreground">
          Sample edition<br />All listings are demonstration content.
        </p>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <Wordmark />
        <Link to="/explore" aria-label="Search" className="flex size-11 items-center justify-center rounded-md hover:bg-accent">
          <Search className="h-5 w-5" />
        </Link>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-28 pt-6 focus:outline-none md:px-8 md:pb-16 md:pt-10 lg:px-10">
        {children}
      </main>

      {/* Mobile bottom tabs */}
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.slice(0, 4).map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex min-h-16 flex-col items-center justify-center gap-1 border-t-2 border-transparent px-1 py-2 text-[10px] text-muted-foreground data-[status=active]:border-primary data-[status=active]:text-primary"
          >
            <Icon className="h-5 w-5" />
            {to === "/explore" ? "Events" : label}
          </Link>
        ))}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" aria-label="More navigation" className="h-16 flex-col gap-1 rounded-none px-1 text-[10px] text-muted-foreground"><Menu className="size-5" />More</Button>
          </SheetTrigger>
          <SheetContent side="bottom" aria-describedby={undefined} className="rounded-t-lg px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <SheetHeader><SheetTitle className="text-left font-display text-2xl">MyWorld</SheetTitle></SheetHeader>
            <nav aria-label="All destinations" className="mt-5 grid gap-2">
              {NAV.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)} activeOptions={{ exact: to === "/" }} className="flex min-h-12 items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-secondary data-[status=active]:bg-accent data-[status=active]:text-primary"><Icon className="size-5 shrink-0" /><span>{label}</span>{to === "/saved" && savedIds.length > 0 && <span className="ml-auto font-mono text-xs">{savedIds.length}</span>}</Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
