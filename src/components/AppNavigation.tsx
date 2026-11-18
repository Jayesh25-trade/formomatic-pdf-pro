import { NavLink } from 'react-router-dom';
import { FilePlus2, History, Building2, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFirm } from '@/context/FirmContext';

export function AppNavigation() {
  const { firm, firmId, setFirmId, availableFirms } = useFirm();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3">
        {/* Left: Firm Switcher (constrained with min-w-0 to prevent overflow on mobile) */}
        <div className="min-w-0 flex-1 max-w-[62%] sm:max-w-xs">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-auto w-full py-1.5 px-2 flex items-center justify-between gap-1.5 hover:bg-accent text-left font-normal"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded bg-primary/10 text-primary shrink-0">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="truncate text-xs sm:text-sm font-bold text-foreground">
                        {firm.displayName}
                      </span>
                      <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 font-mono shrink-0">
                        {firm.shortCode}
                      </Badge>
                    </div>
                    <span className="hidden sm:block text-[10px] text-muted-foreground truncate">
                      Click to switch firm
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Switch Firm / Database
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableFirms.map((f) => {
                const isSelected = f.id === firmId;
                return (
                  <DropdownMenuItem
                    key={f.id}
                    onClick={() => setFirmId(f.id)}
                    className="flex items-center justify-between py-2 cursor-pointer"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-medium text-sm leading-tight flex items-center gap-1.5">
                        <span className="truncate">{f.displayName}</span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-mono shrink-0">
                          {f.invoicePrefix}
                        </Badge>
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {f.gstNo}
                      </p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary ml-2 shrink-0" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: Navigation Links */}
        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 sm:px-3 text-xs sm:text-sm">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'bg-accent text-accent-foreground font-semibold' : '')}>
              <FilePlus2 className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="inline sm:inline">New bill</span>
            </NavLink>
          </Button>
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 sm:px-3 text-xs sm:text-sm">
            <NavLink to="/history" className={({ isActive }) => (isActive ? 'bg-accent text-accent-foreground font-semibold' : '')}>
              <History className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="inline sm:inline">History</span>
            </NavLink>
          </Button>
        </nav>
      </div>
    </header>
  );
}
