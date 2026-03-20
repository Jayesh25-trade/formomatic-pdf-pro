export interface ChallanForm {
  id: string;
  pcNo: string;
  date: string;
  partyName: string;
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
