import type { ChallanForm } from '@/types/challan';

/** Saved bills are ordered oldest-first; only the last one is the latest bill. */
export function getLatestChallan(challans: ChallanForm[]): ChallanForm | null {
  return challans.length > 0 ? challans[challans.length - 1] : null;
}

/** Keep selected history downloads in the same chronological order as the list. */
export function getSelectedChallans(challans: ChallanForm[], selectedIds: string[]): ChallanForm[] {
  const selected = new Set(selectedIds);
  return challans.filter((challan) => selected.has(challan.id));
}