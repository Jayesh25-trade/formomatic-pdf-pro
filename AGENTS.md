# Project Notes

## Architecture
- Saved challans are stored permanently in the Lovable Cloud database (`public.challans` + `public.pc_sequence`); there is no authentication, so both tables are fully open to `anon` via RLS policies. Why: the owner chose an open link over sign-in.
- PC number sequencing lives in `public.pc_sequence` (single row) and is only ever bumped upward by a trigger on challan inserts/updates. Why: deletions or manual edits must never make the next pre-filled PC number go backwards.
- The 15-minute auto-clear applies only to the unsaved in-progress draft (localStorage), never to saved bills. Why: bills must persist permanently per the owner's request.
