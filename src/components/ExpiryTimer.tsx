import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const DRAFT_KEY = 'challan-draft';
const EXPIRY_MS = 15 * 60 * 1000;

export function getDraftAgeMs(): number | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts) return null;
    return Date.now() - Number(parsed.ts);
  } catch {
    return null;
  }
}

// Shows the countdown for the UNSAVED form only. Saved bills live in the
// cloud database and are never auto-cleared.
export function ExpiryTimer() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const age = getDraftAgeMs();
      if (age === null) { setRemaining(null); return; }
      const left = EXPIRY_MS - age;
      setRemaining(left > 0 ? left : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const urgent = remaining < 2 * 60 * 1000;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
      <Clock className="h-3 w-3" />
      <span>Unsaved form clears in {mins}:{secs.toString().padStart(2, '0')}</span>
    </div>
  );
}
