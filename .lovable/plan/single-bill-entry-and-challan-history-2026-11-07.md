## Single-Bill Entry and Challan History

### User experience
- Keep the home page focused on creating or editing one challan at a time; remove the saved-bill list and all-history PDF action from that page.
- After saving a bill, offer a one-bill PDF download so it cannot accidentally export the full history.
- Add a dedicated History page with the saved challans, review, edit, delete, and individual PDF download actions.
- Add selection controls in History to export multiple selected challans together, one A4 page per bill; do not expose bulk history export on the home page.
- Preserve permanent cloud storage, manual PC number editing, and the existing challan PDF design.

### Technical approach
- Add a `/history` route and shared app navigation; reuse the existing cloud storage hook and PDF renderer.
- Extend the challan list with selection and per-record PDF actions; keep edit/delete connected to existing storage operations.
- Add a focused regression test confirming one-bill downloads pass only that bill to the PDF exporter, while bulk downloads use only selected history records.
