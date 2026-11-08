import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChallanFormEntry } from '@/components/ChallanFormEntry';
import { useChallanStorage } from '@/hooks/useChallanStorage';
import { ChallanForm } from '@/types/challan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { ExpiryTimer } from '@/components/ExpiryTimer';
import { toast } from '@/hooks/use-toast';
import { generateChallanPdf } from '@/utils/generatePdf';
import { getLatestChallan } from '@/utils/challanDownloads';
import { AppNavigation } from '@/components/AppNavigation';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { challans, loading, nextPcNo, addChallan, updateChallan } = useChallanStorage();
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state as { editingChallan?: ChallanForm; fromHistory?: boolean } | null;
  const [editing, setEditing] = useState<ChallanForm | null>(routeState?.editingChallan ?? null);
  const latestChallan = getLatestChallan(challans);

  useEffect(() => {
    if (routeState?.editingChallan) setEditing(routeState.editingChallan);
  }, [routeState?.editingChallan]);

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
    const ok = editing ? await updateChallan(challan) : await addChallan(challan);
    if (!ok) return;
    if (editing) {
      setEditing(null);
      toast({ title: 'Form updated' });
      if (routeState?.fromHistory) navigate('/history', { replace: true });
    } else {
      toast({ title: 'Form saved', description: `Total bills: ${challans.length + 1}` });
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 px-4 pb-10">
      <AppNavigation />
      <main className="max-w-2xl mx-auto space-y-6 py-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" style={{ lineHeight: '1.1' }}>
            Delivery Challan Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Parth Fuel Corporation — Prepare and save one bill at a time
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center justify-between gap-2 flex-wrap">
               <span>{editing ? 'Edit bill' : 'New bill'}</span>
              <ExpiryTimer />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChallanFormEntry
              key={editing?.id || `new-${nextPcNo ?? 'x'}`}
              onSubmit={handleSubmit}
              editingChallan={editing}
              onCancelEdit={() => {
                setEditing(null);
                if (routeState?.fromHistory) navigate('/history', { replace: true });
              }}
              defaultPcNo={defaultPcNo}
              suggestions={suggestions}
            />
          </CardContent>
        </Card>

        {latestChallan && (
          <section className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Latest saved bill</h2>
              <p className="text-sm text-muted-foreground">{latestChallan.pcNo || 'No PC number'} · {latestChallan.partyName || 'No party name'}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                generateChallanPdf([latestChallan]);
                toast({ title: 'Latest bill PDF downloaded', description: 'This download contains one A4 page.' });
              }}
            >
              <FileDown className="h-4 w-4" /> Download latest PDF
            </Button>
          </section>
        )}

        {loading && (
          <p className="py-4 text-center text-sm text-muted-foreground">Loading saved bills…</p>
        )}

        {editing && routeState?.fromHistory && (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={() => { setEditing(null); navigate('/history', { replace: true }); }}
          >
            Cancel editing and return to History
          </Button>
        )}
      </main>
    </div>
  );
};

export default Index;
