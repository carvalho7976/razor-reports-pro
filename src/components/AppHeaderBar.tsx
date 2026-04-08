import { Scissors, Bell, Heart, CreditCard, Grid3X3, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AppHeaderBarProps {
  onMenuToggle?: () => void;
}

export function AppHeaderBar({ onMenuToggle }: AppHeaderBarProps) {
  return (
    <header className="h-12 bg-header text-header-foreground flex items-center justify-between px-3 sm:px-4 shrink-0">
      <div className="flex items-center gap-2">
        <button onClick={onMenuToggle} className="p-1.5 hover:bg-header-foreground/10 rounded md:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Scissors className="h-5 w-5" />
          <span>BARBER<span className="text-primary">PRO</span></span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button className="btn-action bg-transparent border border-header-foreground/20 text-header-foreground hover:bg-header-foreground/10 text-xs py-1.5 hidden sm:inline-flex">
          <Heart className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Indicar amigo</span>
        </button>
        <button className="btn-action bg-primary text-primary-foreground text-xs py-1.5">
          <CreditCard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Comandas</span>
        </button>
        <button className="btn-action bg-accent text-accent-foreground text-xs py-1.5 hidden sm:inline-flex">
          <Grid3X3 className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Gaveta</span>
        </button>

        <div className="flex items-center gap-2 ml-1 sm:ml-2">
          <ThemeToggle />
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
