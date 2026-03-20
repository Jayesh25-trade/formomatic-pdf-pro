import { useState, useEffect } from 'react';
import { ChallanForm } from '@/types/challan';

const STORAGE_KEY = 'delivery-challans';

export function useChallanStorage() {
  const [challans, setChallans] = useState<ChallanForm[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challans));
  }, [challans]);

  const addChallan = (challan: ChallanForm) => {
    setChallans(prev => [...prev, challan]);
  };

  const updateChallan = (challan: ChallanForm) => {
    setChallans(prev => prev.map(c => c.id === challan.id ? challan : c));
  };

  const removeChallan = (id: string) => {
    setChallans(prev => prev.filter(c => c.id !== id));
  };

  const clearAll = () => setChallans([]);

  return { challans, addChallan, updateChallan, removeChallan, clearAll };
}
