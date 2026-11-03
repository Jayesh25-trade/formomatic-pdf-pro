import { useState, useMemo } from 'react';
import { ChallanFormEntry } from '@/components/ChallanFormEntry';
import { ChallanList } from '@/components/ChallanList';
import { useChallanStorage } from '@/hooks/useChallanStorage';
import { ChallanForm } from '@/types/challan';
import { generateChallanPdf } from '@/utils/generatePdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, Trash2 } from 'lucide-react';
import { ExpiryTimer } from '@/components/ExpiryTimer';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { challans, loading, nextPcNo, addChallan, updateChallan, removeChallan, clearAll } = useChallanStorage();
  const [editing, setEditing] = useState<ChallanForm | null>(null);
  const [saving, setSaving] = useState(false);

  const defaultPcNo = nextPcNo ? `PC/${nextPcNo}` : undefined;

  // Memory: suggest values the user has used on previous bills.
  const suggestions = useMemo(() => {
    const uniq = (vals: string[]) =>
      Array.from(new Set(vals.map(v => v.trim()).filter(Boolean))).slice(0, 100);
    return {
      partyName: uniq(challans.map(c => c.partyName)),
      truckNo: uniq(challans.map(c => c.truckNo)),
      freightRate: uniq(challans.map(c => c.freightRate)),
      lrNo: uniq(challans.map(c => c.lrNo)),
      lrOf: uniq(challans.map(c => c.lrOf)),
      purchaseOrderNo: uniq(challans.map(c => c.purchaseOrderNo)),
      purchaseOrderDated: uniq(challans.map(c => c.purchaseOrderDated)),
    };
  }, [challans]);

  const handleSubmit = async (challan: ChallanForm) => {
    setSaving(true);
    const ok = editing ? await updateChallan(challan) : await addChallan(challan);
    setSaving(false);
    if (!ok) return;
    if (editing) {
      setEditing(null);
      toast({ title: 'Form updated' });
    } else {
      toast({ title: 'Form saved', description: `Total bills: ${challans.length + 1}` });
    }
  };

  const handleExportPdf = () => {
    if (challans.length === 0) {
      toast({ title: 'No forms to export', variant: 'destructive' });
      return;
    }
    generateChallanPdf(challans);
    toast({ title: 'PDF downloaded', description: `${challans.length} page(s) exported.` });
  };

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" style={{ lineHeight: '1.1' }}>
            Delivery Challan Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Parth Fuel Corporation — Fill multiple forms, export as A4 PDF
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center justify-between gap-2 flex-wrap">
              <span>{editing ? 'Edit Form' : 'New Challan Form'}</span>
              <ExpiryTimer />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChallanFormEntry
              key={editing?.id || `new-${nextPcNo ?? 'x'}`}
              onSubmit={handleSubmit}
              editingChallan={editing}
              onCancelEdit={() => setEditing(null)}
              defaultPcNo={defaultPcNo}
              suggestions={suggestions}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold">
              Saved Bills ({challans.length})
            </h2>
          </div>
          <div className="flex gap-2">
            {challans.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={clearAll} className="gap-1.5 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" /> Clear All
                </Button>
                <Button size="sm" onClick={handleExportPdf} className="gap-1.5">
                  <FileDown className="h-3.5 w-3.5" /> Save as PDF
                </Button>
              </>
            )}
          </div>
        </div>

        <ChallanList
          challans={challans}
          loading={loading}
          onEdit={setEditing}
          onDelete={removeChallan}
        />
      </div>
    </div>
  );
};

export default Index;
