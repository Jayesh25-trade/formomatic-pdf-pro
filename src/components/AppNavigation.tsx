import { NavLink } from 'react-router-dom';
import { FilePlus2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppNavigation() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <NavLink to="/" className="min-w-0">
          <span className="block truncate text-sm font-bold">Parth Fuel Corporation</span>
          <span className="block text-xs text-muted-foreground">Delivery challans</span>
        </NavLink>
        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'bg-accent text-accent-foreground' : ''}>
              <FilePlus2 className="h-4 w-4" /> New bill
            </NavLink>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <NavLink to="/history" className={({ isActive }) => isActive ? 'bg-accent text-accent-foreground' : ''}>
              <History className="h-4 w-4" /> History
            </NavLink>
          </Button>
        </nav>
      </div>
    </header>
  );
}