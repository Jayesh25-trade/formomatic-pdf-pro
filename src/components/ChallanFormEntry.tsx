import { useState, useEffect } from 'react';
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
import { getDraftAgeMs } from '@/components/ExpiryTimer';

interface Props {
  onSubmit: (challan: ChallanForm) => void;
  editingChallan?: ChallanForm | null;
  onCancelEdit?: () => void;
  defaultPcNo?: string;
  suggestions?: Partial<Record<keyof ChallanForm, string[]>>;
}

const DRAFT_KEY = 'challan-draft';
const DRAFT_MAX_AGE_MS = 15 * 60 * 1000;

function loadDraft(): ChallanForm | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.form || !parsed?.ts) return null;
    if (Date.now() - Number(parsed.ts) > DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return parsed.form as ChallanForm;
  } catch {
    return null;
  }
}

export function ChallanFormEntry({ onSubmit, editingChallan, onCancelEdit, defaultPcNo, suggestions }: Props) {
  const [form, setForm] = useState<ChallanForm>(() => {
    if (editingChallan) return editingChallan;
    const draft = loadDraft();
    if (draft) return { ...draft, pcNo: draft.pcNo || defaultPcNo || '' };
    return { ...emptyChallan(), pcNo: defaultPcNo ?? '' };
  });
  const [dateOpen, setDateOpen] = useState(false);

  // Persist the in-progress (unsaved) form; it auto-clears after 15 minutes
  // of inactivity. Saved bills are stored permanently in the cloud database.
  useEffect(() => {
    if (editingChallan) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, ts: Date.now() }));
  }, [form, editingChallan]);

  const handleChange = (field: keyof ChallanForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value } as ChallanForm));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ ...emptyChallan(), pcNo: defaultPcNo ?? '' });
    localStorage.removeItem(DRAFT_KEY);
  };

  const selectedDate = form.date ? new Date(form.date) : undefined;

  const listProps = (field: keyof ChallanForm) =>
    suggestions?.[field]?.length ? { list: 'challan-suggestions' } : {};

  const renderSuggestions = () => {
    if (!suggestions) return null;
    const all = Array.from(
      new Set(Object.values(suggestions).flat().filter(v => v && v.trim()))
    );
    if (all.length === 0) return null;
    return (
      <datalist id="challan-suggestions">
        {all.map(v => <option key={v} value={v} />)}
      </datalist>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderSuggestions()}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pcNo">PC No.</Label>
          <Input id="pcNo" value={form.pcNo} onChange={e => handleChange('pcNo', e.target.value)} placeholder="PC/211" {...listProps('pcNo')} />
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
        <Input id="partyName" value={form.partyName} onChange={e => handleChange('partyName', e.target.value)} placeholder="Kairav Chemofarabe Industries ltd" {...listProps('partyName')} />
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
          <Input id="truckNo" value={form.truckNo} onChange={e => handleChange('truckNo', e.target.value)} placeholder="MH06BW8400" {...listProps('truckNo')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity (M.T.)</Label>
          <Input id="quantity" value={form.quantity} onChange={e => handleChange('quantity', e.target.value)} placeholder="28.650" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="freightRate">Freight Rate</Label>
        <Input id="freightRate" value={form.freightRate} onChange={e => handleChange('freightRate', e.target.value)} placeholder="Enter freight rate" {...listProps('freightRate')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="lrNo">L.R. No.</Label>
          <Input id="lrNo" value={form.lrNo} onChange={e => handleChange('lrNo', e.target.value)} placeholder="LR number" {...listProps('lrNo')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lrOf">Of</Label>
          <Input id="lrOf" value={form.lrOf} onChange={e => handleChange('lrOf', e.target.value)} placeholder="Of" {...listProps('lrOf')} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="purchaseOrderNo">Purchase Order No.</Label>
          <Input id="purchaseOrderNo" value={form.purchaseOrderNo} onChange={e => handleChange('purchaseOrderNo', e.target.value)} placeholder="PO number" {...listProps('purchaseOrderNo')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="purchaseOrderDated">Dated</Label>
          <Input id="purchaseOrderDated" value={form.purchaseOrderDated} onChange={e => handleChange('purchaseOrderDated', e.target.value)} placeholder="PO date" {...listProps('purchaseOrderDated')} />
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
          {editingChallan ? <><Save className="h-4 w-4" /> Update Bill</> : <><Plus className="h-4 w-4" /> Save Bill</>}
        </Button>
        {editingChallan && onCancelEdit && (
          <Button type="button" variant="outline" onClick={onCancelEdit}>Cancel</Button>
        )}
      </div>
    </form>
  );
}
