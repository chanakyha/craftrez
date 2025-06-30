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

export const handleExperienceRecord = async (data: Experience) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.experience.create({
    data: {
      company_name: data.company_name,
      position: data.position,
      start_date: data.start_date,
      end_date: data.end_date,
      place: data.place,
      description: data.description,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateExperienceRecord = async (id: string, data: Experience) => {
  await prisma.experience.update({
    where: { id: id },
    data: {
      company_name: data.company_name,
      position: data.position,
      start_date: data.start_date,
      end_date: data.end_date,
      place: data.place,
      description: data.description,
    },
  });
  revalidateTag("profile");
};

export const deleteExperienceRecord = async (id: string) => {
  await prisma.experience.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};

export const handleProjectRecord = async (data: Project) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      built_for: data.built_for,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateProjectRecord = async (id: string, data: Project) => {
  await prisma.project.update({
    where: { id: id },
    data: {
      name: data.name,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      built_for: data.built_for,
    },
  });
  revalidateTag("profile");
};

export const deleteProjectRecord = async (id: string) => {
  await prisma.project.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};

export const handleCertificationRecord = async (data: Certification) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.certification.create({
    data: {
      name: data.name,
      issuer: data.issuer,
      issue_date: data.issue_date,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateCertificationRecord = async (
  id: string,
  data: Certification
) => {
  await prisma.certification.update({
    where: { id: id },
    data: {
      name: data.name,
      issuer: data.issuer,
      issue_date: data.issue_date,
    },
  });
  revalidateTag("profile");
};

export const deleteCertificationRecord = async (id: string) => {
  await prisma.certification.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};

// Publication CRUD operations
export const handlePublicationRecord = async (data: {
  title: string;
  author: string;
  publisher: string;
  year: number;
  description?: string;
}) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.publication.create({
    data: {
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      year: data.year,
      description: data.description,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updatePublicationRecord = async (
  id: string,
  data: {
    title: string;
    author: string;
    publisher: string;
    year: number;
    description?: string;
  }
) => {
  await prisma.publication.update({
    where: { id: id },
    data: {
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      year: data.year,
      description: data.description,
    },
  });
  revalidateTag("profile");
};

export const deletePublicationRecord = async (id: string) => {
  await prisma.publication.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};

// Achievement CRUD operations
export const handleAchievementRecord = async (data: {
  name: string;
  position: string;
  place: string;
  issuer: string;
  date: Date;
}) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.achievement.create({
    data: {
      name: data.name,
      position: data.position,
      place: data.place,
      issuer: data.issuer,
      date: data.date,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateAchievementRecord = async (
  id: string,
  data: {
    name: string;
    position: string;
    place: string;
    issuer: string;
    date: Date;
  }
) => {
  await prisma.achievement.update({
    where: { id: id },
    data: {
      name: data.name,
      position: data.position,
      place: data.place,
      issuer: data.issuer,
      date: data.date,
    },
  });
  revalidateTag("profile");
};

export const deleteAchievementRecord = async (id: string) => {
  await prisma.achievement.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};

// Responsibility CRUD operations
export const handleResponsibilityRecord = async (data: {
  name: string;
  position: string;
  type: string;
  date: Date;
}) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.responsibility.create({
    data: {
      name: data.name,
      position: data.position,
      type: data.type,
      date: data.date,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateResponsibilityRecord = async (
  id: string,
  data: {
    name: string;
    position: string;
    type: string;
    date: Date;
  }
) => {
  await prisma.responsibility.update({
    where: { id: id },
    data: {
      name: data.name,
      position: data.position,
      type: data.type,
      date: data.date,
    },
  });
  revalidateTag("profile");
};

export const deleteResponsibilityRecord = async (id: string) => {
  await prisma.responsibility.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};

// Interest CRUD operations
export const handleInterestRecord = async (data: { name: string }) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.interest.create({
    data: {
      name: data.name,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateInterestRecord = async (
  id: string,
  data: {
    name: string;
  }
) => {
  await prisma.interest.update({
    where: { id: id },
    data: {
      name: data.name,
    },
  });
  revalidateTag("profile");
};

export const deleteInterestRecord = async (id: string) => {
  await prisma.interest.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};

// Language CRUD operations
export const handleLanguageRecord = async (data: {
  name: string;
  proficiency: string;
}) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.language.create({
    data: {
      name: data.name,
      proficiency: data.proficiency,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateLanguageRecord = async (
  id: string,
  data: {
    name: string;
    proficiency: string;
  }
) => {
  await prisma.language.update({
    where: { id: id },
    data: {
      name: data.name,
      proficiency: data.proficiency,
    },
  });
  revalidateTag("profile");
};

export const deleteLanguageRecord = async (id: string) => {
  await prisma.language.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};

// Skills CRUD operations
export const handleSkillsRecord = async (data: {
  category: string;
  skills: string[];
}) => {
  const user = await currentUser();
  if (!user) return;
  await prisma.skills.create({
    data: {
      category: data.category,
      skills: data.skills,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidateTag("profile");
};

export const updateSkillsRecord = async (
  id: string,
  data: {
    category: string;
    skills: string[];
  }
) => {
  await prisma.skills.update({
    where: { id: id },
    data: {
      category: data.category,
      skills: data.skills,
    },
  });
  revalidateTag("profile");
};

export const deleteSkillsRecord = async (id: string) => {
  await prisma.skills.delete({
    where: { id: id },
  });
  revalidateTag("profile");
};
