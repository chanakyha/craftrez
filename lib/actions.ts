"use server";

import prisma from "./prisma";
import { currentUser } from "@clerk/nextjs/server";

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
