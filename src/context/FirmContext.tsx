import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FirmConfig, FirmId, FIRMS, DEFAULT_FIRM_ID } from '@/config/firms';

interface FirmContextType {
  firmId: FirmId;
  firm: FirmConfig;
  setFirmId: (id: FirmId) => void;
  availableFirms: FirmConfig[];
}

const FirmContext = createContext<FirmContextType | undefined>(undefined);

const STORAGE_KEY = 'formomatic_active_firm';

export const FirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firmId, setFirmIdState] = useState<FirmId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'parth' || saved === 'aarav') {
      return saved;
    }
    return DEFAULT_FIRM_ID;
  });

  const setFirmId = (id: FirmId) => {
    setFirmIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const firm = useMemo(() => FIRMS[firmId] ?? FIRMS[DEFAULT_FIRM_ID], [firmId]);
  const availableFirms = useMemo(() => Object.values(FIRMS), []);

  return (
    <FirmContext.Provider value={{ firmId, firm, setFirmId, availableFirms }}>
      {children}
    </FirmContext.Provider>
  );
};

export function useFirm(): FirmContextType {
  const context = useContext(FirmContext);
  if (!context) {
    throw new Error('useFirm must be used within a FirmProvider');
  }
  return context;
}

