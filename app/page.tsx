import { SignedOut, SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/constants";
import TemplateShowCase from "@/components/template-card";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-3xl font-medium tracking-tight">
            Welcome to RezCredits
          </h1>
          <p className="text-base text-muted-foreground">
            Create and manage your resumes with ease.
          </p>
          <Button variant="outline" className="mt-2">
            Get Started
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium tracking-tight">
              ATS Resume Templates
            </h1>
            <p className="text-base text-muted-foreground">
              Create and manage your resumes with ease.
            </p>
          </div>

          <Button variant="outline">Create My Resume</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8 gap-6">
          {templates.map((template, index) => (
            <TemplateShowCase key={index} template={template} />
          ))}
        </div>
      </SignedIn>
    </div>
  );
}
