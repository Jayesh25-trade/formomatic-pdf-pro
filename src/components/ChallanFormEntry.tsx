import { useState } from 'react';
import { ChallanForm, emptyChallan } from '@/types/challan';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Plus, Save } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface Props {
  onSubmit: (challan: ChallanForm) => void;
  editingChallan?: ChallanForm | null;
  onCancelEdit?: () => void;
}

export function ChallanFormEntry({ onSubmit, editingChallan, onCancelEdit }: Props) {
  const [form, setForm] = useState<ChallanForm>(editingChallan || emptyChallan());
  const [dateOpen, setDateOpen] = useState(false);

  const handleChange = (field: keyof ChallanForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(emptyChallan());
  };

  const selectedDate = form.date ? new Date(form.date) : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pcNo">PC No.</Label>
          <Input id="pcNo" value={form.pcNo} onChange={e => handleChange('pcNo', e.target.value)} placeholder="PC/123" />
        </div>
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => { handleChange('date', d ? d.toISOString() : ''); setDateOpen(false); }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="partyName">Party Name (M/s)</Label>
        <Input id="partyName" value={form.partyName} onChange={e => handleChange('partyName', e.target.value)} placeholder="Kairav Chemofarabe Industries ltd" />
      </div>

      <div className="space-y-2">
        <Label>Material Type</Label>
        <RadioGroup
          value={form.materialType ?? 'coal'}
          onValueChange={(v) => handleChange('materialType', v)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="coal" id="mat-coal" />
            <Label htmlFor="mat-coal" className="font-normal cursor-pointer">India / Import Coal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="briquettes" id="mat-briq" />
            <Label htmlFor="mat-briq" className="font-normal cursor-pointer">Briquettes</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="truckNo">Truck No.</Label>
          <Input id="truckNo" value={form.truckNo} onChange={e => handleChange('truckNo', e.target.value)} placeholder="MH06BW8400" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity (M.T.)</Label>
          <Input id="quantity" value={form.quantity} onChange={e => handleChange('quantity', e.target.value)} placeholder="28.650" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="freightRate">Freight Rate</Label>
        <Input id="freightRate" value={form.freightRate} onChange={e => handleChange('freightRate', e.target.value)} placeholder="Enter freight rate" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="lrNo">L.R. No.</Label>
          <Input id="lrNo" value={form.lrNo} onChange={e => handleChange('lrNo', e.target.value)} placeholder="LR number" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lrOf">Of</Label>
          <Input id="lrOf" value={form.lrOf} onChange={e => handleChange('lrOf', e.target.value)} placeholder="Of" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="purchaseOrderNo">Purchase Order No.</Label>
          <Input id="purchaseOrderNo" value={form.purchaseOrderNo} onChange={e => handleChange('purchaseOrderNo', e.target.value)} placeholder="PO number" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="purchaseOrderDated">Dated</Label>
          <Input id="purchaseOrderDated" value={form.purchaseOrderDated} onChange={e => handleChange('purchaseOrderDated', e.target.value)} placeholder="PO date" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="totalFreightAmount">Total Freight Amount</Label>
        <Input id="totalFreightAmount" value={form.totalFreightAmount} onChange={e => handleChange('totalFreightAmount', e.target.value)} placeholder="Total freight amount" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="advance">Advance</Label>
          <Input id="advance" value={form.advance} onChange={e => handleChange('advance', e.target.value)} placeholder="Advance amount" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="balanceToPay">Balance to Pay</Label>
          <Input id="balanceToPay" value={form.balanceToPay} onChange={e => handleChange('balanceToPay', e.target.value)} placeholder="Balance amount" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="gap-2">
          {editingChallan ? <><Save className="h-4 w-4" /> Update Form</> : <><Plus className="h-4 w-4" /> Add Form</>}
        </Button>
        {editingChallan && onCancelEdit && (
          <Button type="button" variant="outline" onClick={onCancelEdit}>Cancel</Button>
        )}
      </div>
    </form>
  );
}
