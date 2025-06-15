"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CarouselContext = React.createContext<{
  currentSlide: number;
  totalSlides: number;
  setCurrentSlide: (slide: number) => void;
}>({
  currentSlide: 0,
  totalSlides: 0,
  setCurrentSlide: () => {},
});

export function Carousel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  const handleSlideChange = (newSlide: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(newSlide);
    setTimeout(() => setIsTransitioning(false), 500); // Match this with CSS transition duration
  };

  return (
    <CarouselContext.Provider
      value={{
        currentSlide,
        totalSlides,
        setCurrentSlide: handleSlideChange,
      }}
    >
      <div className={cn("relative overflow-hidden", className)} {...props}>
        <div className="relative w-full h-full">
          {React.Children.map(children, (child, index) => (
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              {child}
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            handleSlideChange(
              currentSlide > 0 ? currentSlide - 1 : totalSlides - 1
            )
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 z-20"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            handleSlideChange(
              currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
            )
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 z-20"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 z-20">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                currentSlide === index ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      {children}
    </div>
  );
}
