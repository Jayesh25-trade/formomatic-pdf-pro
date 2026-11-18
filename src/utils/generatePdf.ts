import jsPDF from 'jspdf';
import { ChallanForm } from '@/types/challan';
import { format } from 'date-fns';
import { getFirmForChallan, FirmConfig } from '@/config/firms';

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
  const firm: FirmConfig = getFirmForChallan(c.pcNo);

  // Blessing - red bold italic
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(11);
  doc.setTextColor(200, 0, 0);
  doc.text(firm.blessing, pageW / 2 - 20, y);

  // GST No - blue
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 180);
  doc.text(firm.gstNo, pageW / 2 + 15, y);

  y += 10;

  // FIRM NAME - large red bold
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(180, 0, 0);
  doc.text(firm.headerTitle, pageW / 2, y, { align: 'center' });

  y += 8;

  // Subheader / Category
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(firm.subHeader, pageW / 2, y, { align: 'center' });

  y += 6;

  // Address line
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text(firm.address, pageW / 2, y, { align: 'center' });

  y += 5;

  // Phone & email
  if (firm.emailText) {
    doc.text(`${firm.phoneText} , Email : `, pageW / 2 - 25, y);
    doc.setTextColor(0, 0, 180);
    doc.text(firm.emailText, pageW / 2 + 27, y);
  } else {
    doc.text(firm.phoneText, pageW / 2, y, { align: 'center' });
  }

  y += 5;

  // Branches / State
  doc.setTextColor(0, 0, 0);
  doc.setFont('times', 'normal');
  if (firm.id === 'parth') {
    doc.text('Branches:', pageW / 2 - 22, y);
    doc.setFont('times', 'italic');
    doc.setTextColor(200, 0, 0);
    doc.text(firm.branchText || 'Gujrat And Maharashtra', pageW / 2 - 5, y);
  } else {
    doc.text('State:', pageW / 2 - 25, y);
    doc.setFont('times', 'italic');
    doc.setTextColor(200, 0, 0);
    doc.text(firm.branchText || 'Maharashtra (State Code: 27)', pageW / 2 - 12, y);
  }

  y += 8;

  // Bill / PC No and Date - right aligned
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

  y += 8;

  // DELIVERY CHALLAN title
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('DELIVERY CHALLAN', pageW / 2, y, { align: 'center' });

  y += 8;

  // M/s Party Name
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text('M/s.', margin, y);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text(c.partyName || '', margin + 12, y);
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.line(margin + 10, y + 1, pageW - margin, y + 1);

  y += 7;

  // Second party line
  doc.line(margin, y + 1, pageW - margin, y + 1);

  y += 7;

  // Please receive the following material...
  doc.text('Please receive the following material in good condition as per details given below:', margin, y);

  y += 8;

  // TABLE
  const tableX = margin;
  const tableW = pageW - 2 * margin;
  const col1W = 120; // Material col
  const col2W = tableW - col1W; // Weight col

  // Header row
  doc.rect(tableX, y, tableW, 8);
  doc.line(tableX + col1W, y, tableX + col1W, y + 8);
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text('PARTICULARS', tableX + col1W / 2, y + 5.5, { align: 'center' });
  doc.text('WEIGHT (M.T.)', tableX + col1W + col2W / 2, y + 5.5, { align: 'center' });

  y += 8;

  // Row 1: India / Import Coal (or briquettes)
  const rowH = 7;
  const materialLabel = c.materialType === 'briquettes' ? 'Briquettes' : 'India / Import Coal';

  doc.rect(tableX, y, tableW, rowH);
  doc.line(tableX + col1W, y, tableX + col1W, y + rowH);
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text(materialLabel, tableX + 4, y + 5);

  y += rowH;

  // Row 2: Truck No & Qty
  doc.rect(tableX, y, tableW, rowH);
  doc.line(tableX + col1W, y, tableX + col1W, y + rowH);
  doc.setFont('times', 'normal');
  doc.text('Truck No.', tableX + 4, y + 5);
  doc.setFont('times', 'bold');
  doc.text(c.truckNo || '', tableX + 26, y + 5);

  // Quantity in weight col
  if (c.quantity) {
    doc.text(c.quantity, tableX + col1W + col2W / 2, y + 5, { align: 'center' });
  }

  y += rowH;

  // Row 3: Freight Rate
  doc.rect(tableX, y, tableW, rowH);
  doc.line(tableX + col1W, y, tableX + col1W, y + rowH);
  doc.setFont('times', 'normal');
  doc.text('Freight Rate', tableX + 4, y + 5);
  doc.text(c.freightRate || '', tableX + 30, y + 5);

  y += rowH;

  // Row 4: L.R. No & Of
  doc.rect(tableX, y, tableW, rowH);
  doc.line(tableX + col1W, y, tableX + col1W, y + rowH);
  doc.text('L.R. No.', tableX + 4, y + 5);
  doc.text(c.lrNo || '', tableX + 22, y + 5);
  doc.text('Of', tableX + 55, y + 5);
  doc.text(c.lrOf || '', tableX + 63, y + 5);

  y += rowH;

  // Total row
  doc.rect(tableX, y, tableW, rowH);
  doc.line(tableX + col1W, y, tableX + col1W, y + rowH);
  doc.setFont('times', 'bold');
  doc.text('TOTAL', tableX + 4, y + 5);
  if (c.quantity) {
    doc.text(c.quantity, tableX + col1W + col2W / 2, y + 5, { align: 'center' });
  }

  y += rowH;

  // Empty row
  doc.rect(tableX, y, tableW, rowH);
  doc.line(tableX + col1W, y, tableX + col1W, y + rowH);

  y += rowH;

  // Table bottom space
  y += 8;

  // IN account of M/s
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text('IN account of M/s.', margin, y);
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text(firm.inAccountOf, margin + 38, y);
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
  doc.text(firm.signatoryTitle, pageW - margin, y, { align: 'right' });
  y += 5;
  doc.setFontSize(10);
  doc.text(firm.signatoryPhone, pageW - margin, y, { align: 'right' });
}
