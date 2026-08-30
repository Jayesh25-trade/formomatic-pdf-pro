import { ChallanForm } from '@/types/challan';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  challan: ChallanForm;
  index: number;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%] break-words">{value || '—'}</span>
    </div>
  );
}

export function ChallanPreview({ challan, index }: Props) {
  const dateStr = challan.date ? format(new Date(challan.date), 'dd/MM/yyyy') : '—';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Challan #{index + 1} — {challan.pcNo || 'No PC No.'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-0 px-1">
            {/* Header */}
            <div className="text-center pb-3 mb-3 border-b">
              <p className="text-xs font-bold italic" style={{ color: 'hsl(0, 80%, 40%)' }}>||Jai Gajanan||</p>
              <p className="text-lg font-bold tracking-tight" style={{ color: 'hsl(0, 80%, 35%)', lineHeight: '1.1' }}>
                PARTH FUEL CORPORATION
              </p>
              <p className="text-[10px] font-semibold tracking-wider">INDIAN IMPORT COAL MARCHANT</p>
            </div>

            <Field label="PC No." value={challan.pcNo} />
            <Field label="Date" value={dateStr} />
            <Field label="Party Name (M/s)" value={challan.partyName} />
            <Field label="Material" value={challan.materialType === 'briquettes' ? 'Briquettes' : 'India / Import Coal'} />
            <Field label="Truck No." value={challan.truckNo} />
            <Field label="Quantity (M.T.)" value={challan.quantity} />
            <Field label="Freight Rate" value={challan.freightRate} />
            <Field label="L.R. No." value={challan.lrNo} />
            <Field label="Of" value={challan.lrOf} />
            <Field label="Purchase Order No." value={challan.purchaseOrderNo} />
            <Field label="Dated" value={challan.purchaseOrderDated} />
            <Field label="Total Freight Amount" value={challan.totalFreightAmount} />
            <Field label="Advance" value={challan.advance} />
            <Field label="Balance to Pay" value={challan.balanceToPay} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
