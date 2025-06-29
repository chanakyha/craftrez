"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import EducationCard from "./components/education-card";
import ExperienceCard from "./components/experience-card";
import ProjectCard from "./components/project-card";
import CertificationCard from "./components/certification-card";
import PublicationCard from "./components/publication-card";
import SkillsCard from "./components/skills-card";
import AchievementCard from "./components/achievement-card";
import ResponsibilityCard from "./components/responsibility-card";
import InterestCard from "./components/interest-card";
import LanguageCard from "./components/language-card";

interface ProfileClientProps {
  user: User;
}

const ProfileClient = ({ user }: ProfileClientProps) => {
  const renderResumes = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          <CardTitle>Resumes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.resumes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No resume records found
          </p>
        ) : (
          user.resumes.map((resume) => (
            <div key={resume.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-semibold">{resume.template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {resume.template.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created:{" "}
                    {format(new Date(resume.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {/* User Info */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold">
                  {user.FullName?.charAt(0) || user.username?.charAt(0) || "U"}
                </span>
              </div>
            )}
            <div>
              <CardTitle className="text-2xl">
                {user.FullName || user.username || "User"}
              </CardTitle>
              <CardDescription>
                {user.email?.[0]?.email || "No email"}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{user.credits} Credits</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <EducationCard educations={user.educations} />
        <ExperienceCard experiences={user.experiences} />
        <ProjectCard projects={user.projects} />
        <CertificationCard certifications={user.certifications} />
        <PublicationCard publications={user.publications} />
        <SkillsCard skills={user.skills} />
        <AchievementCard achievements={user.achievements} />
        <ResponsibilityCard responsibilities={user.responsibilities} />
        <InterestCard interests={user.interests} />
        <LanguageCard languages={user.languages} />
        {renderResumes()}
      </div>
    </div>
  );
};

export default ProfileClient;
