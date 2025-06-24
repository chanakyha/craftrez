"use client";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { expireSession } from "@/lib/actions";
import { toast } from "sonner";

const ExpireSessionButton = ({ session_id }: { session_id: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExpireSession = async () => {
    setIsLoading(true);
    try {
      await expireSession(session_id);
      toast.success("Session expired successfully");
    } catch (error) {
      toast.error("Failed to expire session");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExpireSession}
      disabled={isLoading}
      className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
      isLoading={isLoading}
      loadingText="Expiring Session..."
    >
      Expire Session
    </Button>
  );
};

export default ExpireSessionButton;
