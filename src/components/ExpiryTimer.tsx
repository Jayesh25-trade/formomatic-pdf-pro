import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const TIMESTAMP_KEY = 'delivery-challans-timestamp';
const EXPIRY_MS = 15 * 60 * 1000;

export function ExpiryTimer({ formCount }: { formCount: number }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (formCount === 0) {
      setRemaining(null);
      return;
    }

    const tick = () => {
      const ts = localStorage.getItem(TIMESTAMP_KEY);
      if (!ts) { setRemaining(null); return; }
      const left = EXPIRY_MS - (Date.now() - Number(ts));
      setRemaining(left > 0 ? left : 0);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [formCount]);

  if (remaining === null || formCount === 0) return null;

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const urgent = remaining < 2 * 60 * 1000;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
      <Clock className="h-3 w-3" />
      <span>Auto-clear in {mins}:{secs.toString().padStart(2, '0')}</span>
    </div>
  );
}
