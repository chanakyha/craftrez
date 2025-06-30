"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Wrench, X, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  handleSkillsRecord,
  updateSkillsRecord,
  deleteSkillsRecord,
} from "@/lib/actions";
import { toast } from "sonner";

const skillsFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

type SkillsFormValues = z.infer<typeof skillsFormSchema>;

interface SkillsCardProps {
  skills: Skills[];
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [editingSkill, setEditingSkill] = useState<Skills | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState<Skills | null>(null);

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      category: "",
      skills: [],
    },
  });

  const onSubmit = async (data: SkillsFormValues) => {
    try {
      if (editingSkill) {
        await updateSkillsRecord(editingSkill.id.toString(), data);
        toast.success("Skills updated successfully!");
      } else {
        await handleSkillsRecord(data);
        toast.success("Skills added successfully!");
      }
      setDialogOpen(false);
      setEditingSkill(null);
      form.reset();
      setSkillInput("");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const addSkill = () => {
    if (
      skillInput.trim() &&
      !form.getValues("skills").includes(skillInput.trim())
    ) {
      const currentSkills = form.getValues("skills");
      form.setValue("skills", [...currentSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills");
    form.setValue(
      "skills",
      currentSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleEdit = (skill: Skills) => {
    setEditingSkill(skill);
    form.reset({
      category: skill.category,
      skills: skill.skills,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (skill: Skills) => {
    setDeletingSkill(skill);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSkill) return;

    try {
      await deleteSkillsRecord(deletingSkill.id.toString());
      toast.success("Skills deleted successfully!");
      setDeleteDialogOpen(false);
      setDeletingSkill(null);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    form.reset({
      category: "",
      skills: [],
    });
    setSkillInput("");
    setDialogOpen(true);
  };

  const currentSkills = form.watch("skills");

  return (
    <Card className="overflow-hidden border border-border/50 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Skills
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your technical expertise and competencies
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={handleAddNew}
              className="hover:bg-primary/10 hover:border-primary/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Edit Skills" : "Add Skills"}
              </DialogTitle>
              <DialogDescription>
                {editingSkill
                  ? "Edit the skills category."
                  : "Add a new skill category to your profile."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Programming Languages, Frameworks"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Skills</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill} size="sm">
                      Add
                    </Button>
                  </div>
                  {currentSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentSkills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? editingSkill
                        ? "Updating..."
                        : "Adding..."
                      : editingSkill
                      ? "Update Skills"
                      : "Add Skills"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No skills added yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your skills to showcase your expertise and capabilities
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 hover:shadow-sm hover:border-primary/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mt-1">
                          <Wrench className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-3 flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                            {skill.category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {skill.skills.map((skillName, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                              >
                                {skillName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(skill)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(skill)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              skills category &ldquo;{deletingSkill?.category}&rdquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
