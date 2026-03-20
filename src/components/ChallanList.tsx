import { ChallanForm } from '@/types/challan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ChallanPreview } from './ChallanPreview';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  challans: ChallanForm[];
  onEdit: (challan: ChallanForm) => void;
  onDelete: (id: string) => void;
}

function buildShareText(c: ChallanForm, i: number): string {
  const dateStr = c.date ? format(new Date(c.date), 'dd/MM/yyyy') : '—';
  return [
    `📋 Delivery Challan #${i + 1}`,
    `PC No: ${c.pcNo || '—'}`,
    `Date: ${dateStr}`,
    `Party: ${c.partyName || '—'}`,
    `Truck No: ${c.truckNo || '—'}`,
    `Qty: ${c.quantity || '—'} M.T.`,
    c.freightRate ? `Freight Rate: ${c.freightRate}` : '',
    c.totalFreightAmount ? `Total Freight: ${c.totalFreightAmount}` : '',
    c.advance ? `Advance: ${c.advance}` : '',
    c.balanceToPay ? `Balance to Pay: ${c.balanceToPay}` : '',
    '',
    '— Parth Fuel Corporation',
  ].filter(Boolean).join('\n');
}

function ShareButton({ challan, index }: { challan: ChallanForm; index: number }) {
  const text = buildShareText(challan, index);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Delivery Challan #${index + 1}`, text });
      } catch { /* user cancelled */ }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(`Delivery Challan #${index + 1}`)}&body=${encodeURIComponent(text)}`, '_blank');
  };

  // If native share is available, use it directly
  if (navigator.share) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNativeShare}>
        <Share2 className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopy}>Copy to Clipboard</DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsApp}>WhatsApp</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>Email</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
            <div className="flex gap-0.5 ml-3">
              <ChallanPreview challan={c} index={i} />
              <ShareButton challan={c} index={i} />
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
