import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { clerkId } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      include: {
        educations: true,
        experiences: true,
        projects: true,
        certifications: true,
        publications: true,
        achievements: true,
        responsibilities: true,
        interests: true,
        languages: true,
        skills: true,
        resumes: {
          include: {
            template: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile", errorMessage: error },
      { status: 500 }
    );
  }
}
