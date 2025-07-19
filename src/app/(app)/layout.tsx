import { type ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10 h-16">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="container mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
