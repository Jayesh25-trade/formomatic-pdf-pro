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
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-auto py-1 px-2.5 flex items-center gap-2 hover:bg-accent text-left font-normal"
              >
                <div className="flex items-center justify-center h-7 w-7 rounded bg-primary/10 text-primary shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {firm.displayName}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 font-mono">
                      {firm.shortCode}
                    </Badge>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </div>
                  <span className="block text-[11px] text-muted-foreground truncate">
                    Active firm • Click to switch
                  </span>
                </div>
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
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm leading-tight flex items-center gap-1.5">
                        {f.displayName}
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-mono">
                          {f.invoicePrefix}
                        </Badge>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
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

        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'bg-accent text-accent-foreground' : '')}>
              <FilePlus2 className="h-4 w-4 mr-1.5" /> New bill
            </NavLink>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <NavLink to="/history" className={({ isActive }) => (isActive ? 'bg-accent text-accent-foreground' : '')}>
              <History className="h-4 w-4 mr-1.5" /> History
            </NavLink>
          </Button>
        </nav>
      </div>
    </header>
  );
}
