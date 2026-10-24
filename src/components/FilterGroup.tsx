// A labelled set of toggle chips. Selecting nothing means "show all".
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function FilterGroup({ label, options, selected, onToggle }: Props) {
  return (
    <fieldset>
      <legend className="eyebrow mb-2 text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(opt)}
              className={cn(
                "border px-2.5 py-1 text-xs transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "bg-card hover:border-foreground",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-full border-b-2 border-foreground bg-transparent py-3 font-display text-2xl outline-none placeholder:text-muted-foreground/60 focus:border-primary md:text-3xl"
    />
  );
}
