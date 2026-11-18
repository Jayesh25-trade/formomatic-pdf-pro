# Project Notes

## Architecture
- Multi-firm support allows switching between **Parth Fuel Corporation** (`PC/` prefix, starting around 211+) and **Aarav Traders** (`AT/` prefix, starting at 1).
- Saved challans are stored permanently in the Lovable Cloud database (`public.challans` + `public.pc_sequence`); there is no authentication, so both tables are fully open to `anon` via RLS policies. Why: the owner chose an open link over sign-in.
- Bills are strictly partitioned by firm based on their bill prefix (`PC/` vs `AT/`). When switching firm in the header, History and new bill generation automatically scope to that firm's database.
- PC number sequencing for Parth Fuel lives in `public.pc_sequence` (single row) and is bumped upward by a trigger on challan inserts/updates. Aarav Traders sequences incrementally based on highest existing AT bill number.
- The 15-minute auto-clear applies only to the unsaved in-progress draft (localStorage, keyed per firm), never to saved bills. Why: bills must persist permanently per the owner's request.
- Keep bill entry and PDF download for a single challan on the home page; place browsing, CRUD, and multi-bill export on the dedicated History route. Why: prevent accidental full-history downloads while keeping archived bills accessible.
