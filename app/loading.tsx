import { SparkleIcon } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <SparkleIcon className="w-16 h-16 text-primary animate-spin" />

          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground animate-pulse">
            Loading...
          </h2>
          <p className="text-sm text-muted-foreground">
            Preparing your resume builder
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
