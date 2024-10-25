"use client";

import React from "react";
import { Loader2, Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "@/components/sidebar-content";
import { usePathname } from "next/navigation";
import { ClerkLoaded, UserButton, ClerkLoading } from "@clerk/nextjs";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const path = usePathname();

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden absolute top-4 left-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r shrink-0">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 space-y-3 sm:space-y-0">
            {path !== "/" ? (
              <div className="w-full sm:w-auto mb-2 sm:mb-0 pl-12 ">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full sm:w-[400px] max-w-[500px]"
                />
              </div>
            ) : (
              <div className="w-full sm:w-auto mb-2 sm:mb-0 pl-12 "></div>
            )}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <ModeToggle />
              <ClerkLoaded>
                <UserButton />
              </ClerkLoaded>
              <ClerkLoading>
                <Loader2 className="size-8 animate-spin text-slate-400" />
              </ClerkLoading>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
