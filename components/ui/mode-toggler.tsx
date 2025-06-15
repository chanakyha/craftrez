"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const sunRef = React.useRef<SVGSVGElement>(null);
  const moonRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (theme === "dark") {
      gsap.to(sunRef.current, {
        scale: 0,
        rotation: -90,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(moonRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(sunRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(moonRef.current, {
        scale: 0,
        rotation: 90,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun ref={sunRef} className="h-[1.2rem] w-[1.2rem]" />
      <Moon ref={moonRef} className="absolute h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
