// The app frame: navigation rail on desktop, top bar + bottom tabs on mobile.
import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, Compass, Home, Search, SlidersHorizontal, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useSaved } from "@/lib/saved";

const NAV = [
  { to: "/", label: "My Feed", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/communities", label: "Communities", icon: Users },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/preferences", label: "Preferences", icon: SlidersHorizontal },
] as const;

function Wordmark() {
  return (
    <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
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
  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen flex-col gap-8 border-r px-5 py-7 md:flex">
        <Wordmark />
        <QuickSearch />
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group flex items-center gap-3 border-l-2 border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:border-primary data-[status=active]:font-medium data-[status=active]:text-foreground"
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{label}</span>
              {to === "/saved" && savedIds.length > 0 && (
                <span className="font-mono text-xs text-primary">{savedIds.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <p className="mt-auto text-xs leading-relaxed text-muted-foreground">
          Round 1 preview. All content shown is sample data.
        </p>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <Wordmark />
        <Link to="/explore" aria-label="Search" className="p-2">
          <Search className="h-5 w-5" />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:px-10 md:pb-16 md:pt-10">
        {children}
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-background md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 border-t-2 border-transparent py-2 text-[10px] text-muted-foreground data-[status=active]:border-primary data-[status=active]:text-primary"
          >
            <Icon className="h-5 w-5" />
            {label.replace("My ", "")}
          </Link>
        ))}
      </nav>
    </div>
  );
}
