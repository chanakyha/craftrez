import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider>{children}</ClerkProvider>
    </ThemeProvider>
  );
};

export default Providers;
