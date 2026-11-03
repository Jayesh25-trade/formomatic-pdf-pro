import type { Database } from '@/integrations/supabase/types';
import { ChallanForm, MaterialType } from './challan';

export type ChallanRow = Database['public']['Tables']['challans']['Row'];

export function pcNumberFrom(pcNo: string): number | null {
  const m = pcNo.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

export function fromDb(row: ChallanRow): ChallanForm {
  return {
    id: row.id,
    pcNo: row.pc_no,
    date: row.date ?? '',
    partyName: row.party_name,
    materialType: (row.material_type as MaterialType) || 'coal',
    truckNo: row.truck_no,
    quantity: row.quantity,
    freightRate: row.freight_rate,
    lrNo: row.lr_no,
    lrOf: row.lr_of,
    purchaseOrderNo: row.purchase_order_no,
    purchaseOrderDated: row.purchase_order_dated,
    totalFreightAmount: row.total_freight_amount,
    advance: row.advance,
    balanceToPay: row.balance_to_pay,
  };
}

export function toDb(c: ChallanForm) {
  return {
    pc_no: c.pcNo,
    pc_number: pcNumberFrom(c.pcNo),
    date: c.date ? c.date.slice(0, 10) : null,
    party_name: c.partyName,
    material_type: c.materialType,
    truck_no: c.truckNo,
    quantity: c.quantity,
    freight_rate: c.freightRate,
    lr_no: c.lrNo,
    lr_of: c.lrOf,
    purchase_order_no: c.purchaseOrderNo,
    purchase_order_dated: c.purchaseOrderDated,
    total_freight_amount: c.totalFreightAmount,
    advance: c.advance,
    balance_to_pay: c.balanceToPay,
  };
}
