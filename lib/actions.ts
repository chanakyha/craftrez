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

export const refreshAllSessions = async () => {
  revalidateTag("transactions");
};

export const handleEducationRecord = async (data: Education) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.education.create({
    data: {
      school_name: data.school_name,
      degree: data.degree,
      place: data.place,
      start_date: data.start_date,
      end_date: data.end_date,
      marks: data.marks,
      marksOutof: data.marksOutof,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateEducationRecord = async (id: string, data: Education) => {
  await prisma.education.update({
    where: { id: id },
    data: {
      school_name: data.school_name,
      degree: data.degree,
      place: data.place,
      start_date: data.start_date,
      end_date: data.end_date,
      marks: data.marks,
      marksOutof: data.marksOutof,
    },
  });
  revalidateTag("profile");
};

export const deleteEducationRecord = async (id: string) => {
  await prisma.education.delete({
    where: { id: id },
  });

  revalidateTag("profile");
};
