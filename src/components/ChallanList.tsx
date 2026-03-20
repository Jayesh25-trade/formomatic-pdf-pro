import { ChallanForm } from '@/types/challan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  challans: ChallanForm[];
  onEdit: (challan: ChallanForm) => void;
  onDelete: (id: string) => void;
}

export function ChallanList({ challans, onEdit, onDelete }: Props) {
  if (challans.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No forms added yet. Fill in the form above and click "Add Form".
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {challans.map((c, i) => (
        <Card key={c.id} className="group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">
                #{i + 1} — {c.pcNo || 'No PC No.'} · {c.date ? format(new Date(c.date), 'dd/MM/yyyy') : 'No date'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {c.partyName || 'No party'} · Truck: {c.truckNo || '—'} · Qty: {c.quantity || '—'} M.T.
              </div>
            </div>
            <div className="flex gap-1 ml-3">
              <Button variant="ghost" size="icon" onClick={() => onEdit(c)} className="h-8 w-8">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
