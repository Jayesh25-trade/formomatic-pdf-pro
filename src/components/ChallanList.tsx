import { ChallanForm } from '@/types/challan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Share2, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { ChallanPreview } from './ChallanPreview';
import { toast } from '@/hooks/use-toast';
import { generateChallanBlob } from '@/utils/generatePdf';
import { generateChallanPdf } from '@/utils/generatePdf';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  challans: ChallanForm[];
  loading?: boolean;
  onEdit: (challan: ChallanForm) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onToggleSelected: (id: string) => void;
}

function ShareButton({ challan, index }: { challan: ChallanForm; index: number }) {
  const fileName = `Challan-${index + 1}.pdf`;

  const getPdfFile = (): File => {
    const blob = generateChallanBlob([challan]);
    return new File([blob], fileName, { type: 'application/pdf' });
  };

  const handleNativeShare = async () => {
    const file = getPdfFile();
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: fileName, files: [file] });
      } catch { /* user cancelled */ }
    } else {
      // fallback: download
      downloadPdf();
    }
  };

  const downloadPdf = () => {
    const blob = generateChallanBlob([challan]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'PDF downloaded' });
  };

  const handleWhatsApp = () => {
    // WhatsApp Web doesn't support file sharing via URL, so download first
    downloadPdf();
    toast({ title: 'PDF downloaded — attach it in WhatsApp manually' });
  };

  const handleEmail = () => {
    // Download PDF and open email compose
    downloadPdf();
    window.open(
      `mailto:?subject=${encodeURIComponent(fileName)}&body=${encodeURIComponent('Please find the attached Delivery Challan.')}`,
      '_blank'
    );
  };

  // If native share with file support is available, use it directly
  if (typeof navigator.share === 'function' && typeof navigator.canShare === 'function') {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNativeShare}>
        <Share2 className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadPdf}>Download PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsApp}>WhatsApp (download first)</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>Email</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ChallanList({ challans, loading, onEdit, onDelete, selectedIds, onToggleSelected }: Props) {
  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading saved bills…
      </div>
    );
  }

  if (challans.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No bills match this search.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {challans.map((c, i) => (
        <Card key={c.id} className="group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm tracking-wide">
                #{i + 1} — <span className="text-foreground">{c.pcNo || 'No PC No.'}</span> · {c.date ? format(new Date(c.date), 'dd/MM/yyyy') : 'No date'}
              </div>
              <div className="text-xs font-semibold text-muted-foreground truncate">
                {c.partyName || 'No party'} · <span className="font-bold text-foreground">Truck: {c.truckNo || '—'}</span> · <span className="font-bold text-foreground">Qty: {c.quantity || '—'} M.T.</span>
              </div>
            </div>
            <div className="flex gap-0.5 ml-3">
              <Checkbox
                aria-label={`Select ${c.pcNo || `bill ${i + 1}`} for PDF export`}
                checked={selectedIds.includes(c.id)}
                onCheckedChange={() => onToggleSelected(c.id)}
                className="mr-2 self-center"
              />
              <ChallanPreview challan={c} index={i} />
              <ShareButton challan={c} index={i} />
              <Button
                variant="ghost"
                size="icon"
                title="Download this bill as PDF"
                aria-label={`Download ${c.pcNo || `bill ${i + 1}`} as PDF`}
                onClick={() => {
                  generateChallanPdf([c]);
                  toast({ title: 'Bill PDF downloaded', description: `${c.pcNo || `Bill ${i + 1}`} saved as one A4 page.` });
                }}
                className="h-8 w-8"
              >
                <FileDown className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onEdit(c)} className="h-8 w-8">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
