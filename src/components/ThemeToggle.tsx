// Light/dark switch. Icon renders only after mount so SSR and client agree.
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { toggleTheme, useIsDark } from '@/lib/theme';
import { Button } from '@/components/ui/button';

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useIsDark();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const Icon = mounted && dark ? Sun : Moon;
  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={toggleTheme}
      aria-label={mounted && dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mounted && dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
    >
      <Icon className="size-4" />
    </Button>
  );
}
