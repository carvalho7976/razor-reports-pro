import { Scissors, Bell, Heart, CreditCard, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";

export function AppHeaderBar() {
  return (
    <header className="h-12 bg-header text-header-foreground flex items-center justify-between px-4 shrink-0">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
        <Scissors className="h-5 w-5" />
        <span>BARBER<span className="text-primary">PRO</span></span>
      </Link>

      <div className="flex items-center gap-3">
        <button className="btn-action bg-transparent border border-header-foreground/20 text-header-foreground hover:bg-header-foreground/10 text-xs py-1.5">
          <Heart className="h-3.5 w-3.5" />
          Indicar amigo
        </button>
        <button className="btn-action bg-primary text-primary-foreground text-xs py-1.5">
          <CreditCard className="h-3.5 w-3.5" />
          Comandas
        </button>
        <button className="btn-action bg-accent text-accent-foreground text-xs py-1.5">
          <Grid3X3 className="h-3.5 w-3.5" />
          Gaveta
        </button>

        <div className="flex items-center gap-2 ml-2">
          <button className="relative p-1.5 hover:bg-header-foreground/10 rounded">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center gap-2 ml-1">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              LP
            </div>
            <span className="text-xs font-medium hidden sm:block">Lara</span>
          </div>
        </div>
      </div>
    </header>
  );
}
