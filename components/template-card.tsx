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
import { DownloadIcon, Eye, Sparkles } from "lucide-react";

const TemplateShowCase = ({ template }: { template: Template }) => {
  return (
    <>
      <div className="group relative w-full max-w-md overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <div className="relative overflow-hidden rounded-lg bg-background">
          <Carousel className="w-full aspect-[1/1.414]">
            {template.images.map((image: string) => (
              <CarouselItem key={image}>
                <div className="relative w-full h-full bg-muted/50">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Image
                      src={image}
                      alt={template.name}
                      fill
                      className="object-contain transition-all duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <h2 className="text-lg font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          {template.name}
                        </h2>
                      </div>
                      <p className="text-stone-300 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {template.description}
                      </p>
                      <div className="grid grid-cols-2 gap-3 my-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl w-full h-[40rem] md:h-[55rem] p-0 overflow-hidden">
                            <div className="flex flex-col h-full">
                              <div className="flex-1 overflow-hidden bg-muted/30">
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
                                  <DialogTitle className="text-xl text-foreground flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
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
                          size="sm"
                          className="text-primary-foreground shadow-sm"
                        >
                          <Link
                            href={`/editor?template=${template.id}`}
                            className="w-full flex items-center justify-center"
                          >
                            Use Template
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default TemplateShowCase;
