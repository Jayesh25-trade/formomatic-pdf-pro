import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChallanForm } from '@/types/challan';
import { fromDb, toDb, pcNumberFrom } from '@/types/challanDb';
import { toast } from '@/hooks/use-toast';
import { useFirm } from '@/context/FirmContext';
import { getFirmForChallan } from '@/config/firms';

export function useChallanStorage() {
  const { firm } = useFirm();
  const [allChallans, setAllChallans] = useState<ChallanForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPcSequenceNo, setNextPcSequenceNo] = useState<number | null>(null);

  const refreshSequence = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('pc_sequence')
        .select('last_pc_no')
        .eq('id', 1)
        .maybeSingle();
      if (data?.last_pc_no) {
        setNextPcSequenceNo(data.last_pc_no + 1);
      }
    } catch {
      // fallback to calculating from existing challans
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('challans')
        .select('*')
        .order('created_at', { ascending: true });
      if (cancelled) return;
      if (error) {
        toast({ title: 'Could not load saved bills', description: error.message, variant: 'destructive' });
      } else {
        setAllChallans((data ?? []).map(fromDb));
      }
      setLoading(false);
      refreshSequence();
    })();
    return () => { cancelled = true; };
  }, [refreshSequence]);

  // Filter bills strictly by the active firm
  const challans = useMemo(() => {
    return allChallans.filter(c => getFirmForChallan(c.pcNo).id === firm.id);
  }, [allChallans, firm.id]);

  // Calculate next bill number based on active firm
  const nextBillNo = useMemo<number>(() => {
    if (firm.id === 'parth') {
      const pcNumbers = allChallans
        .filter(c => getFirmForChallan(c.pcNo).id === 'parth')
        .map(c => pcNumberFrom(c.pcNo))
        .filter((n): n is number => n !== null);
      const maxFromBills = pcNumbers.length > 0 ? Math.max(...pcNumbers) + 1 : firm.defaultStartingNumber;
      if (nextPcSequenceNo) {
        return Math.max(nextPcSequenceNo, maxFromBills);
      }
      return maxFromBills;
    } else {
      // Aarav Traders sequence: max from AT challans + 1, or defaultStartingNumber (1)
      const atNumbers = allChallans
        .filter(c => getFirmForChallan(c.pcNo).id === 'aarav')
        .map(c => pcNumberFrom(c.pcNo))
        .filter((n): n is number => n !== null);
      if (atNumbers.length > 0) {
        return Math.max(...atNumbers) + 1;
      }
      return firm.defaultStartingNumber;
    }
  }, [firm.id, firm.defaultStartingNumber, allChallans, nextPcSequenceNo]);

  const defaultBillNo = useMemo(() => {
    return `${firm.invoicePrefix}${nextBillNo}`;
  }, [firm.invoicePrefix, nextBillNo]);

  const addChallan = async (challan: ChallanForm): Promise<boolean> => {
    // Ensure bill number has appropriate prefix if missing
    let billNo = challan.pcNo.trim();
    if (!billNo) {
      billNo = defaultBillNo;
    } else if (!billNo.toUpperCase().startsWith(firm.shortCode)) {
      // If user typed only a number (e.g. "246" or "1"), prepend the active firm prefix
      if (/^\d+$/.test(billNo)) {
        billNo = `${firm.invoicePrefix}${billNo}`;
      }
    }

    const preparedChallan: ChallanForm = {
      ...challan,
      pcNo: billNo,
    };

    const { data, error } = await supabase
      .from('challans')
      .insert(toDb(preparedChallan))
      .select()
      .single();
    if (error || !data) {
      toast({ title: 'Could not save form', description: error?.message, variant: 'destructive' });
      return false;
    }
    setAllChallans(prev => [...prev, fromDb(data)]);
    refreshSequence();
    return true;
  };

  const updateChallan = async (challan: ChallanForm): Promise<boolean> => {
    const { data, error } = await supabase
      .from('challans')
      .update(toDb(challan))
      .eq('id', challan.id)
      .select()
      .single();
    if (error || !data) {
      toast({ title: 'Could not update form', description: error?.message, variant: 'destructive' });
      return false;
    }
    setAllChallans(prev => prev.map(c => (c.id === challan.id ? fromDb(data) : c)));
    refreshSequence();
    return true;
  };

  const removeChallan = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('challans').delete().eq('id', id);
    if (error) {
      toast({ title: 'Could not delete form', description: error.message, variant: 'destructive' });
      return false;
    }
    setAllChallans(prev => prev.filter(c => c.id !== id));
    return true;
  };

  const clearAll = async () => {
    // Only delete bills for the active firm to protect the other firm's database!
    const idsToDelete = challans.map(c => c.id);
    if (idsToDelete.length === 0) {
      toast({ title: 'No bills to clear' });
      return;
    }

    const { error } = await supabase
      .from('challans')
      .delete()
      .in('id', idsToDelete);
    if (error) {
      toast({ title: 'Could not clear forms', description: error.message, variant: 'destructive' });
      return;
    }
    setAllChallans(prev => prev.filter(c => !idsToDelete.includes(c.id)));
    toast({ title: `All ${firm.displayName} saved forms cleared` });
  };

  return {
    challans,
    allChallans,
    loading,
    nextPcNo: nextBillNo, // for backward-compatibility
    nextBillNo,
    defaultBillNo,
    addChallan,
    updateChallan,
    removeChallan,
    clearAll,
  };
}
