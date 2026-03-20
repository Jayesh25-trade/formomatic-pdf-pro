
## Delivery Challan Form Builder

### What We're Building
A web app that replicates the **Parth Fuel Corporation - Delivery Challan / Freight Advice** form exactly as shown in the image. Users fill in multiple forms and export all as a multi-page A4 PDF (one form per page).

### Pages & Flow

**1. Form Entry Page (Home)**
- A form with all editable fields: PC No., Date, Party Name (M/s), Truck No., Quantity (MT), Freight Rate, LR No. & Of, Purchase Order No. & Dated, Total Freight Amount, Advance, Balance to Pay
- "Add Form" button saves current form to a list and resets for next entry
- Shows count of filled forms with a list/preview below
- Each saved form can be edited or deleted
- All forms saved to localStorage for persistence

**2. PDF Export**
- "Save as PDF" button generates a PDF using jsPDF
- Each form renders on its own A4 page, matching the exact layout, fonts, colors, and formatting from the image:
  - "||Jai Gajanan||" in red bold, GST number in blue
  - "PARTH FUEL CORPORATION" large red heading
  - "INDIAN IMPORT COAL MARCHANT" subtitle
  - Address, phone, email (blue hyperlink style), branches in italic
  - "DELIVERY CHALLAN / FREIGHT ADVICE" underlined bold center heading
  - All static text and field labels exactly as shown
  - "THANKING YOU" in blue, company name and mob at bottom right

### Design Details
- Form input UI uses clean input fields with labels matching the challan
- PDF output replicates the exact visual format from the image with proper fonts and colors
- A4 sizing enforced in PDF output

### Technical Approach
- React components for form entry and form list management
- localStorage for saving/loading forms
- jsPDF for PDF generation with precise positioning to match the challan layout
- All on the frontend, no backend needed
