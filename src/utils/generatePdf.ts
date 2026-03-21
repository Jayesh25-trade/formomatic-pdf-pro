import jsPDF from 'jspdf';
import { ChallanForm } from '@/types/challan';
import { format } from 'date-fns';

export function generateChallanPdf(challans: ChallanForm[]) {
  const doc = buildChallanDoc(challans);
  doc.save('delivery-challans.pdf');
}

export function generateChallanBlob(challans: ChallanForm[]): Blob {
  const doc = buildChallanDoc(challans);
  return doc.output('blob');
}

function buildChallanDoc(challans: ChallanForm[]): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;

  challans.forEach((challan, index) => {
    if (index > 0) doc.addPage();
    renderChallanPage(doc, challan, pageW);
  });

  return doc;
}

function renderChallanPage(doc: jsPDF, c: ChallanForm, pageW: number) {
  const margin = 20;
  let y = 18;

  // ||Jai Gajanan|| - red bold italic
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(11);
  doc.setTextColor(200, 0, 0);
  doc.text('||Jai Gajanan||', pageW / 2 - 20, y);

  // GST No - blue
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 180);
  doc.text('GST No. 27AREPM6726C1ZV', pageW / 2 + 15, y);

  y += 10;

  // PARTH FUEL CORPORATION - large red bold
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(180, 0, 0);
  doc.text('PARTH FUEL CORPORATION', pageW / 2, y, { align: 'center' });

  y += 8;

  // INDIAN IMPORT COAL MARCHANT
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('INDIAN  IMPORT  COAL  MARCHANT', pageW / 2, y, { align: 'center' });

  y += 6;

  // Address line
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text('Matkarri galli , Plot No.7, Near Bustand, Shegaon \u2013 444203 Dist. Buldhana', pageW / 2, y, { align: 'center' });

  y += 5;

  // Phone & email
  doc.text('M : 9881125511 / 7020709696 , Email : ', pageW / 2 - 25, y);
  doc.setTextColor(0, 0, 180);
  doc.text('parthfuelcorporation23@gmail.com', pageW / 2 + 27, y);

  y += 5;

  // Branches
  doc.setTextColor(0, 0, 0);
  doc.setFont('times', 'normal');
  doc.text('Branches:', pageW / 2 - 22, y);
  doc.setFont('times', 'italic');
  doc.setTextColor(200, 0, 0);
  doc.text('Gujrat And Maharashtra', pageW / 2 - 5, y);

  y += 8;

  // PC No and Date - right aligned
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(200, 0, 0);
  doc.text(c.pcNo || '___', pageW - margin, y, { align: 'right' });
  y += 5;
  doc.setFontSize(10);
  const dateStr = c.date ? format(new Date(c.date), 'dd/MM/yyyy') : '___/___/______';
  doc.text(dateStr, pageW - margin, y, { align: 'right' });

  y += 6;

  // Horizontal line
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);

  y += 7;

  // DELIVERY CHALLAN / FREIGHT ADVICE - centered bold underlined
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  const titleText = 'DELIVERY CHALLAN / FREIGHT ADVICE';
  const titleWidth = doc.getTextWidth(titleText);
  const titleX = (pageW - titleWidth) / 2;
  doc.text(titleText, pageW / 2, y, { align: 'center' });
  doc.setLineWidth(0.4);
  doc.line(titleX, y + 1, titleX + titleWidth, y + 1);

  y += 5;

  // Another line
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);

  y += 8;

  // Body text
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // To,
  doc.text('To,', margin, y);
  y += 6;
  doc.text('The Store Department', margin, y);
  y += 7;

  // M/s line
  doc.text('M / s.', margin, y);
  doc.setFont('times', 'bold');
  doc.text(c.partyName || '________________________________', margin + 14, y);
  doc.setLineWidth(0.2);
  doc.line(margin + 14, y + 1, pageW - margin, y + 1);

  y += 10;

  doc.setFont('times', 'normal');
  doc.text('Dear sir,', margin, y);

  y += 7;

  // Truck line
  doc.text('We are Despatching Truck No.', margin, y);
  doc.setFont('times', 'bold');
  doc.text(c.truckNo || '________________', margin + 56, y);
  doc.setFont('times', 'normal');
  doc.setLineWidth(0.2);
  doc.line(margin + 56, y + 1, pageW - margin, y + 1);

  y += 7;

  // Coal line
  doc.text('OF INDIA COAL / IMPORT COAL with Qty.', margin, y);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text(c.quantity || '________', margin + 73, y);
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text('M.T.', pageW - margin - 8, y);
  doc.setLineWidth(0.2);
  doc.line(margin + 73, y + 1, pageW - margin - 10, y + 1);

  y += 7;

  // Freight Rate
  doc.text('@Freight Rate', margin, y);
  doc.text(c.freightRate || '', margin + 30, y);
  doc.line(margin + 28, y + 1, pageW - margin, y + 1);

  y += 7;

  // LR No
  doc.text('Under L.R. No.', margin, y);
  doc.text(c.lrNo || '', margin + 30, y);
  doc.line(margin + 28, y + 1, margin + 65, y + 1);
  doc.text('Of', margin + 68, y);
  doc.text(c.lrOf || '', margin + 76, y);
  doc.line(margin + 74, y + 1, pageW - margin, y + 1);

  y += 8;

  // IN account of M/s
  doc.text('IN account of M/s.', margin, y);
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text('PARTH FUEL CORPORATION', margin + 38, y);
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.line(margin + 36, y + 1, pageW - margin, y + 1);

  y += 7;

  // Purchase Order
  doc.text('Under Purchase Order No.', margin, y);
  doc.text(c.purchaseOrderNo || '', margin + 50, y);
  doc.line(margin + 48, y + 1, margin + 95, y + 1);
  doc.text('Dated', margin + 98, y);
  doc.text(c.purchaseOrderDated || '', margin + 112, y);
  doc.line(margin + 110, y + 1, pageW - margin, y + 1);

  y += 7;

  // Total Freight Amount
  doc.text('Total Fright Amount', margin, y);
  doc.text(c.totalFreightAmount || '', margin + 42, y);
  doc.line(margin + 40, y + 1, pageW - margin, y + 1);

  y += 7;

  // Advance
  doc.setFont('times', 'bold');
  doc.text('ADVANCE', margin, y);
  doc.setFont('times', 'normal');
  doc.text(c.advance || '', margin + 28, y);
  doc.line(margin + 26, y + 1, pageW - margin, y + 1);

  y += 7;

  // Balance to Pay
  doc.setFont('times', 'bold');
  doc.text('BALANCE TO PAY', margin, y);
  doc.setFont('times', 'normal');
  doc.text(c.balanceToPay || '', margin + 40, y);
  doc.line(margin + 38, y + 1, pageW - margin, y + 1);

  y += 16;

  // Kindly accept
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 180);
  doc.text('Kindly accept the material and acknowledge the same', margin, y);

  y += 14;

  // THANKING YOU
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 180);
  doc.text('THANKING YOU', margin, y);

  // Right side - company name and mob
  doc.setTextColor(0, 0, 0);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('PARTH FUEL CORPORATION', pageW - margin, y, { align: 'right' });
  y += 5;
  doc.setFontSize(10);
  doc.text('Mob : 9881125511', pageW - margin, y, { align: 'right' });
}
