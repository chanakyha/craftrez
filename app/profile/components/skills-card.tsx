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
import { Plus, Edit, Wrench, X } from "lucide-react";
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

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      category: "",
      skills: [],
    },
  });

  const onSubmit = (data: SkillsFormValues) => {
    console.log(data);
    setDialogOpen(false);
    form.reset();
    setSkillInput("");
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

  const currentSkills = form.watch("skills");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          <CardTitle>Skills</CardTitle>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skills
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Skills</DialogTitle>
              <DialogDescription>
                Add a new skill category to your profile.
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
                    {form.formState.isSubmitting ? "Adding..." : "Add Skills"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No skills added yet</p>
            <p className="text-sm">
              Add your skills to showcase your expertise
            </p>
          </div>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-semibold">{skill.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.skills.map((skillName, index) => (
                      <Badge key={index} variant="secondary">
                        {skillName}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
