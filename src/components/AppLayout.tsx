import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeaderBar } from "./AppHeaderBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <SidebarInset>
        <AppHeaderBar />
        <main className="flex-1 overflow-auto p-3 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
