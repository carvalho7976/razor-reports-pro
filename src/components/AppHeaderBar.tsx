import { Scissors, Bell, Heart, CreditCard, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeaderBar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-header px-3 text-header-foreground sm:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden hover:bg-header-foreground/10 hover:text-header-foreground" />

        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Scissors className="h-5 w-5" />
          <span>
            BARBER<span className="text-primary">PRO</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button className="btn-action hidden border border-header-foreground/20 bg-transparent py-1.5 text-xs text-header-foreground hover:bg-header-foreground/10 sm:inline-flex">
          <Heart className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Indicar amigo</span>
        </button>

        <button className="btn-action bg-primary py-1.5 text-xs text-primary-foreground">
          <CreditCard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Comandas</span>
        </button>

        <button className="btn-action hidden bg-accent py-1.5 text-xs text-accent-foreground sm:inline-flex">
          <Grid3X3 className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Gaveta</span>
        </button>

        <div className="ml-1 flex items-center gap-2 sm:ml-2">
          <ThemeToggle />

          <button className="relative rounded p-1.5 hover:bg-header-foreground/10">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              3
            </span>
          </button>

          <div className="ml-1 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              LP
            </div>
            <span className="hidden text-xs font-medium sm:block">Lara</span>
          </div>
        </div>
      </div>
    </header>
  );
}
