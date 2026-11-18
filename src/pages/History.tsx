import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownToLine, Check, CheckSquare, FilePlus2, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AppNavigation } from '@/components/AppNavigation';
import { ChallanList } from '@/components/ChallanList';
import { useChallanStorage } from '@/hooks/useChallanStorage';
import { ChallanForm } from '@/types/challan';
import { generateChallanPdf } from '@/utils/generatePdf';
import { getSelectedChallans } from '@/utils/challanDownloads';
import { toast } from '@/hooks/use-toast';
import { useFirm } from '@/context/FirmContext';

const History = () => {
  const { firm } = useFirm();
  const { challans, loading, removeChallan } = useChallanStorage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<ChallanForm | null>(null);

  const filteredChallans = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return challans;
    return challans.filter((challan) =>
      [challan.pcNo, challan.partyName, challan.truckNo, challan.date]
        .some((value) => value.toLocaleLowerCase().includes(term)),
    );
  }, [challans, search]);

  const selectedChallans = getSelectedChallans(challans, selectedIds);
  const allVisibleSelected = filteredChallans.length > 0 && filteredChallans.every((bill) => selectedIds.includes(bill.id));

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]);
  };

  const toggleVisible = () => {
    const visibleIds = new Set(filteredChallans.map((bill) => bill.id));
    setSelectedIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.has(id))
      : Array.from(new Set([...current, ...visibleIds])));
  };

  const handleBulkDownload = () => {
    if (selectedChallans.length === 0) return;
    generateChallanPdf(selectedChallans);
    toast({ title: 'Selected bills downloaded', description: `${selectedChallans.length} bill(s), one A4 page each.` });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    const deleted = await removeChallan(id);
    if (deleted) {
      setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
      setPendingDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 px-4 pb-10">
      <AppNavigation />
      <main className="mx-auto max-w-5xl space-y-6 py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{firm.displayName}</p>
            <h1 className="text-2xl font-bold">Bill history</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading saved bills…' : `${challans.length} saved bill${challans.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="gap-2">
            <FilePlus2 className="h-4 w-4" /> Create new bill
          </Button>
        </div>

        <div className="flex flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search bill history"
              placeholder={`Search ${firm.shortCode} number, party or truck`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleVisible} disabled={filteredChallans.length === 0}>
              {allVisibleSelected ? <CheckSquare className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              <span className="ml-1.5 hidden sm:inline">{allVisibleSelected ? 'Deselect visible' : 'Select all visible'}</span>
            </Button>
            {selectedIds.length > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-muted-foreground">
                  <X className="h-4 w-4" /> Clear ({selectedIds.length})
                </Button>
                <Button size="sm" onClick={handleBulkDownload} className="gap-1.5">
                  <ArrowDownToLine className="h-4 w-4" />
                  Download selected ({selectedIds.length})
                </Button>
              </>
            )}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
            <span>{selectedIds.length} bill(s) selected for combined download</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-primary underline" onClick={() => setSelectedIds([])}>
              Clear selection
            </Button>
          </div>
        )}

        <ChallanList
          challans={filteredChallans}
          loading={loading}
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          onEdit={(challan) => navigate('/', { state: { editingChallan: challan, fromHistory: true } })}
          onDelete={(id) => {
            const found = challans.find((b) => b.id === id);
            if (found) setPendingDelete(found);
          }}
        />

        {!loading && filteredChallans.length === 0 && (
          <Card className="text-center">
            <CardContent className="py-12 space-y-3">
              <p className="text-base font-semibold">No bills found for {firm.displayName}</p>
              <p className="text-sm text-muted-foreground">
                {search ? 'Try clearing your search query.' : `No bills have been saved under ${firm.displayName} yet.`}
              </p>
              <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
                <FilePlus2 className="h-4 w-4" /> Create first {firm.shortCode} bill
              </Button>
            </CardContent>
          </Card>
        )}

        <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this saved bill?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete bill <strong>{pendingDelete?.pcNo || 'Untitled'}</strong> ({pendingDelete?.partyName || 'No party name'}) from {firm.displayName}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                <Trash2 className="h-4 w-4 mr-1.5" /> Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default History;
