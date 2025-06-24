import type { Metadata } from "next";

import "./globals.css";

import { sfProDisplay } from "@/public/fonts/SfProDisplay/sfpro-display";
import Providers from "./providers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CraftRez",
  description: "AI-powered resume builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`antialiased font-bold ${sfProDisplay.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Header />
            <main className="flex-1 h-container  w-full ">{children}</main>
            <Footer />
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
