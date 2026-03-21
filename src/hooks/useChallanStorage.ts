import { useState, useEffect } from 'react';
import { ChallanForm } from '@/types/challan';

const STORAGE_KEY = 'delivery-challans';
const TIMESTAMP_KEY = 'delivery-challans-timestamp';
const EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export function useChallanStorage() {
  const [challans, setChallans] = useState<ChallanForm[]>(() => {
    try {
      const timestamp = localStorage.getItem(TIMESTAMP_KEY);
      if (timestamp && Date.now() - Number(timestamp) > EXPIRY_MS) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TIMESTAMP_KEY);
        return [];
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challans));
    if (challans.length > 0) {
      localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
    }
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

  const clearAll = () => {
    setChallans([]);
    localStorage.removeItem(TIMESTAMP_KEY);
  };

  return { challans, addChallan, updateChallan, removeChallan, clearAll };
}
