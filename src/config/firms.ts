export type FirmId = 'parth' | 'aarav';

export interface FirmConfig {
  id: FirmId;
  displayName: string;
  shortCode: string;
  invoicePrefix: string;
  defaultStartingNumber: number;
  blessing: string;
  headerTitle: string;
  subHeader: string;
  gstNo: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  phoneText: string;
  emailText?: string;
  branchText?: string;
  inAccountOf: string;
  signatoryTitle: string;
  signatoryPhone: string;
  badgeVariant?: 'default' | 'secondary' | 'outline';
}

export const FIRMS: Record<FirmId, FirmConfig> = {
  parth: {
    id: 'parth',
    displayName: 'Parth Fuel Corporation',
    shortCode: 'PC',
    invoicePrefix: 'PC/',
    defaultStartingNumber: 211,
    blessing: '||Jai Gajanan||',
    headerTitle: 'PARTH FUEL CORPORATION',
    subHeader: 'INDIAN  IMPORT  COAL  MARCHANT',
    gstNo: 'GST No. 27AREPM6726C1ZV',
    address: 'Matkarri galli , Plot No.7, Near Bustand, Shegaon \u2013 444203 Dist. Buldhana',
    city: 'Shegaon \u2013 444203 Dist. Buldhana',
    state: 'Maharashtra',
    stateCode: '27',
    phoneText: 'M : 9881125511 / 7020709696',
    emailText: 'parthfuelcorporation23@gmail.com',
    branchText: 'Gujrat And Maharashtra',
    inAccountOf: 'PARTH FUEL CORPORATION',
    signatoryTitle: 'PARTH FUEL CORPORATION',
    signatoryPhone: 'Mob : 9881125511',
  },
  aarav: {
    id: 'aarav',
    displayName: 'Aarav Traders',
    shortCode: 'AT',
    invoicePrefix: 'AT/',
    defaultStartingNumber: 1,
    blessing: '||Jai Gajanan||',
    headerTitle: 'AARAV TRADERS',
    subHeader: 'SHEGAON',
    gstNo: 'GST No. 27AKIPM5661P1ZE',
    address: 'SHOP NO 11 APMC MARKET, SHEGAON \u2013 444203',
    city: 'SHEGAON - 444203',
    state: 'Maharashtra',
    stateCode: '27',
    phoneText: 'M : 9881125511 / 7020709696',
    emailText: '',
    branchText: 'Maharashtra (State Code: 27)',
    inAccountOf: 'AARAV TRADERS',
    signatoryTitle: 'AARAV TRADERS',
    signatoryPhone: 'Mob : 9881125511',
  },
};

export const DEFAULT_FIRM_ID: FirmId = 'parth';

/**
 * Determine which firm a challan belongs to based on its bill/pc number.
 * Anything starting with AT or AT/ is Aarav Traders; otherwise default to Parth Fuel Corporation.
 */
export function getFirmForChallan(pcNo?: string | null): FirmConfig {
  if (!pcNo) return FIRMS[DEFAULT_FIRM_ID];
  const normalized = pcNo.trim().toUpperCase();
  if (normalized.startsWith('AT')) {
    return FIRMS.aarav;
  }
  return FIRMS.parth;
}

