"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import * as React from "react";

interface DashboardHamburgerProps {
  children: React.ReactNode;
}

export function DashboardHamburger({ children }: DashboardHamburgerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {!open && (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-6 left-4 z-[70]"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="left"
        className="w-64 p-0 bg-white"
        onNavigate={() => setOpen(false)}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
