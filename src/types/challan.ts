export type MaterialType = 'coal' | 'briquettes';

export interface ChallanForm {
  id: string;
  pcNo: string;
  date: string;
  partyName: string;
  materialType: MaterialType;
  truckNo: string;
  quantity: string;
  freightRate: string;
  lrNo: string;
  lrOf: string;
  purchaseOrderNo: string;
  purchaseOrderDated: string;
  totalFreightAmount: string;
  advance: string;
  balanceToPay: string;
}

export const emptyChallan = (): ChallanForm => ({
  id: crypto.randomUUID(),
  pcNo: '',
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
