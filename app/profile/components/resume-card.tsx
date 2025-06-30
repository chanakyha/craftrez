import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { Resume } from "@/lib/generated/prisma";

interface ResumeCardProps {
  resumes: Resume[];
}

const ResumeCard = ({ resumes }: ResumeCardProps) => (
  <Card className="md:col-span-2 overflow-hidden border border-border/50 bg-card shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold text-foreground">
            Resumes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your created resume templates
          </p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-6 space-y-4">
      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No resumes yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Create your first resume to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 hover:shadow-sm hover:border-primary/20"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          Resume {resume.id}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created{" "}
                            {format(new Date(resume.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                      <Download className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default ResumeCard;
