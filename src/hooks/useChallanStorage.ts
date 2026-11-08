import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChallanForm } from '@/types/challan';
import { fromDb, toDb } from '@/types/challanDb';
import { toast } from '@/hooks/use-toast';

export function useChallanStorage() {
  const [challans, setChallans] = useState<ChallanForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPcNo, setNextPcNo] = useState<number | null>(null);

  const refreshSequence = useCallback(async () => {
    const { data } = await supabase
      .from('pc_sequence')
      .select('last_pc_no')
      .eq('id', 1)
      .maybeSingle();
    if (data) setNextPcNo(data.last_pc_no + 1);
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
        setChallans((data ?? []).map(fromDb));
      }
      setLoading(false);
      refreshSequence();
    })();
    return () => { cancelled = true; };
  }, [refreshSequence]);

  const addChallan = async (challan: ChallanForm): Promise<boolean> => {
    const { data, error } = await supabase
      .from('challans')
      .insert(toDb(challan))
      .select()
      .single();
    if (error || !data) {
      toast({ title: 'Could not save form', description: error?.message, variant: 'destructive' });
      return false;
    }
    setChallans(prev => [...prev, fromDb(data)]);
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
    setChallans(prev => prev.map(c => (c.id === challan.id ? fromDb(data) : c)));
    refreshSequence();
    return true;
  };

  const removeChallan = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('challans').delete().eq('id', id);
    if (error) {
      toast({ title: 'Could not delete form', description: error.message, variant: 'destructive' });
      return false;
    }
    setChallans(prev => prev.filter(c => c.id !== id));
    return true;
  };

  const clearAll = async () => {
    const { error } = await supabase
      .from('challans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      toast({ title: 'Could not clear forms', description: error.message, variant: 'destructive' });
      return;
    }
    setChallans([]);
    toast({ title: 'All saved forms cleared' });
  };

  return { challans, loading, nextPcNo, addChallan, updateChallan, removeChallan, clearAll };
}
