import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";

interface YouTubeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl?: string;
}

export function YouTubeModal({ open, onOpenChange, videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ" }: YouTubeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden bg-black border-0">
        <div className="aspect-video w-full">
          <iframe
            src={open ? videoUrl : ""}
            title="Aula"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AulaButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--background))]/10 text-primary text-xs font-medium hover:bg-muted border border-primary/30 transition-colors"
      title="Assistir aula"
    >
      <PlayCircle className="h-4 w-4" />
      Aula
    </button>
  );
}
