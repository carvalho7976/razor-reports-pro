import { Bell, Heart, CreditCard, Grid3X3, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import frizzarLogo from "@/assets/frizzar-logo.png";

export function AppHeaderBar() {
  const { toggleSidebar, state, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";

  return (
    <header className="flex h-12 shrink-0 items-center justify-between bg-transparent px-3 text-foreground sm:px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 hover:bg-black/5 transition-colors md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center">
          <img
            src={frizzarLogo}
            alt="Frizzar"
            className="h-7 w-auto object-contain dark:invert"
          />
        </Link>

      </div>


      <div className="flex items-center gap-2 sm:gap-3">
        <button className="btn-action hidden border border-border bg-transparent py-1.5 text-xs text-foreground hover:bg-black/5 sm:inline-flex">
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

          <button className="relative rounded p-1.5 hover:bg-black/5">
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
