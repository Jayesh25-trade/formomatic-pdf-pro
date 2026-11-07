import { describe, expect, it } from 'vitest';
import type { ChallanForm } from '@/types/challan';
import { getLatestChallan, getSelectedChallans } from '@/utils/challanDownloads';

const bill = (id: string, pcNo: string): ChallanForm => ({
  id,
  pcNo,
  date: '',
  partyName: '',
  materialType: 'coal',
  truckNo: '',
  quantity: '',
  freightRate: '',
  lrNo: '',
  lrOf: '',
  purchaseOrderNo: '',
  purchaseOrderDated: '',
  totalFreightAmount: '',
  advance: '',
  balanceToPay: '',
});

describe('challan download selection', () => {
  it('returns only the latest saved bill for a home-page download', () => {
    const bills = [bill('older', 'PC/210'), bill('latest', 'PC/211')];

    expect(getLatestChallan(bills)).toBe(bills[1]);
    expect(getLatestChallan([])).toBeNull();
  });

  it('exports only selected history bills in saved order', () => {
    const bills = [bill('one', 'PC/211'), bill('two', 'PC/212'), bill('three', 'PC/213')];

    expect(getSelectedChallans(bills, ['three', 'one'])).toEqual([bills[0], bills[2]]);
  });
});