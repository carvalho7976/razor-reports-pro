import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeaderBar } from "./AppHeaderBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <SidebarInset className="min-w-0 bg-background pl-2">
        <AppHeaderBar />
        <main className="h-[calc(100svh-3rem)] overflow-auto p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
