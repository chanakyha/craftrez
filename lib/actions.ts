"use server";

import prisma from "./prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export const getCredits = async () => {
  const user = await currentUser();
  if (!user) {
    return 0;
  }
  const userData = await prisma.user.findUnique({
    where: { clerkId: user?.id },
  });
  return userData?.credits;
};

export const expireSession = async (session_id: string) => {
  await fetch("http://localhost:3000/api/expire-session", {
    method: "POST",
    body: JSON.stringify({ session_id }),
  });

  revalidateTag("session");
};
