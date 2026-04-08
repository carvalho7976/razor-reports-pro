import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";

interface AulaButtonProps {
  videoUrl?: string;
  onOpen?: () => void;
}

export function AulaButton({ videoUrl, onOpen }: AulaButtonProps) {
  return (
    <button
      onClick={onOpen}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card text-primary text-xs font-medium hover:bg-muted border border-primary/30 transition-colors"
      title="Assistir aula"
    >
      <PlayCircle className="h-4 w-4" />
      Aula
    </button>
  );
}

interface YouTubeModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

function getEmbedUrl(url: string): string {
  // Handle various YouTube URL formats
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  return url;
}

export function YouTubeModal({ open, onClose, videoUrl, title }: YouTubeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border [&>button]:text-foreground">
        {title && (
          <div className="px-5 pt-4 pb-2">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
        )}
        <div className="aspect-video w-full">
          {open && (
            <iframe
              src={getEmbedUrl(videoUrl)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title || "Aula"}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
