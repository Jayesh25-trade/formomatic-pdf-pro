import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownToLine, CheckSquare, FilePlus2, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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

const History = () => {
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
    await removeChallan(id);
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
    setPendingDelete(null);
  };

  return (
    <div className="min-h-screen bg-muted/40 px-4 pb-10">
      <AppNavigation />
      <main className="mx-auto max-w-5xl space-y-6 py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Parth Fuel Corporation</p>
            <h1 className="text-2xl font-bold">Bill history</h1>
            <p className="text-sm text-muted-foreground">{loading ? 'Loading saved bills…' : `${challans.length} saved bill${challans.length === 1 ? '' : 's'}`}</p>
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
              placeholder="Search PC number, party or truck"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleVisible} disabled={filteredChallans.length === 0}>
              <Checkbox checked={allVisibleSelected} className="pointer-events-none mr-1" aria-hidden="true" />
              {allVisibleSelected ? 'Clear visible' : 'Select visible'}
            </Button>
            {selectedIds.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                <X className="h-4 w-4" /> Clear selection
              </Button>
            )}
            <Button onClick={handleBulkDownload} disabled={selectedChallans.length === 0} size="sm" className="gap-2">
              <ArrowDownToLine className="h-4 w-4" /> Download selected ({selectedChallans.length})
            </Button>
          </div>
        </div>

        {filteredChallans.length === 0 && !loading ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <div className="rounded-full bg-muted p-3 text-muted-foreground"><CheckSquare className="h-5 w-5" /></div>
              <div>
                <h2 className="font-semibold">{challans.length === 0 ? 'No saved bills yet' : 'No matching bills'}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {challans.length === 0 ? 'Your saved bills will appear here.' : 'Try another PC number, party name or truck number.'}
                </p>
              </div>
              {challans.length === 0 && <Button variant="outline" onClick={() => navigate('/')}>Create your first bill</Button>}
            </CardContent>
          </Card>
        ) : (
          <ChallanList
            challans={filteredChallans}
            loading={loading}
            onEdit={(challan) => navigate('/', { state: { editingChallan: challan, fromHistory: true } })}
            onDelete={(id) => setPendingDelete(challans.find((challan) => challan.id === id) ?? null)}
            selectedIds={selectedIds}
            onToggleSelected={toggleSelected}
          />
        )}
      </main>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this saved bill?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.pcNo || 'This bill'} will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep bill</AlertDialogCancel>
            <AlertDialogAction onClick={(event) => { event.preventDefault(); void confirmDelete(); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="h-4 w-4" /> Delete bill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;