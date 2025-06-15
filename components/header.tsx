"use client";

import { routes } from "@/lib/constants";
import { Menu, Sparkle, User } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggler";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { SignInButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container p-4 max-w-7xl mx-auto flex h-14 items-center">
        <div className="mr-4 flex group">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkle className="h-6 w-6 rotate-45 group-hover:rotate-[135deg] transition-transform duration-300" />
            <span className="font-bold">CraftRez</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  "text-foreground/60"
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
          <SignInButton mode="modal">
            <Button variant="outline">
              <User className="h-5 w-5" /> Sign In
            </Button>
          </SignInButton>

          <nav className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-foreground/80",
                        "text-foreground/60"
                      )}
                    >
                      {route.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
