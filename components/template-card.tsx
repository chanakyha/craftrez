"use client";

import Image from "next/image";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import { DownloadIcon } from "lucide-react";

const TemplateShowCase = ({ template }: { template: Template }) => {
  return (
    <>
      <div className="w-full max-w-md bg-stone-200 dark:bg-stone-950  p-4 overflow-hidden group relative  shadow-lg border rounded-md">
        <Carousel className="w-full aspect-[1/1.414]">
          {template.images.map((image: string) => (
            <CarouselItem key={image}>
              <div className="relative w-full h-full bg-black/80">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Image
                    src={image}
                    alt={template.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h2 className="text-lg font-bold text-foreground transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {template.name}
                  </h2>
                  <p className="text-muted-foreground text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {template.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 my-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Preview Template</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl w-full h-[40rem] md:h-[55rem] p-0">
                        <div className="flex flex-col h-full">
                          <div className="flex-1 overflow-hidden bg-muted/50">
                            <Carousel className="w-full h-full">
                              {template.images.map((image: string) => (
                                <CarouselItem
                                  className="rounded-md"
                                  key={image}
                                >
                                  <div className="relative rounded-md w-full h-full flex items-center justify-center p-8">
                                    <Image
                                      src={image}
                                      alt={template.name}
                                      fill
                                      className="object-contain rounded-md"
                                      priority
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </Carousel>
                          </div>
                          <div className="p-6 border-t bg-background">
                            <DialogHeader>
                              <DialogTitle className="text-xl text-foreground">
                                {template.name}
                              </DialogTitle>
                              <DialogDescription className="text-sm text-muted-foreground">
                                {template.description}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-4 flex justify-between">
                              <Button
                                asChild
                                className="flex items-center justify-center"
                              >
                                <Link
                                  href={`/editor?template=${template.id}`}
                                  className=""
                                >
                                  Use this Template
                                </Link>
                              </Button>
                              <Button
                                asChild
                                size={"icon"}
                                variant="outline"
                                className="flex items-center justify-center"
                              >
                                <Link
                                  target="_blank"
                                  href={template.downloadLink}
                                >
                                  <DownloadIcon className="w-4 h-4" />
                                </Link>
                              </Button>
                            </DialogFooter>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="default"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link
                        href={`/editor?template=${template.id}`}
                        className="w-full"
                      >
                        Use this Template
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default TemplateShowCase;
