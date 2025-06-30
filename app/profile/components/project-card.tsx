"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Edit, Code, Trash } from "lucide-react";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { z } from "zod";
import {
  deleteProjectRecord,
  handleProjectRecord,
  updateProjectRecord,
} from "@/lib/actions";
import { toast } from "sonner";

const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  built_for: z.string().min(1, "Built for is required"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  description: z.string().optional(),
  id: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectCardProps {
  projects: Project[];
}

export default function ProjectCard({ projects }: ProjectCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      built_for: "",
      start_date: new Date(),
      end_date: new Date(),
      description: "",
      id: undefined,
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsLoading(true);
      if (data.id) {
        await updateProjectRecord(data.id, data as unknown as Project);
        toast.success("Project record updated successfully");
      } else {
        await handleProjectRecord(data as unknown as Project);
        toast.success("Project record added successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Project record addition failed");
    } finally {
      setIsLoading(false);
    }
    setDialogOpen(false);
    form.reset();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <CardTitle>Projects</CardTitle>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {form.getValues("id") ? "Edit Project" : "Add Project"}
              </DialogTitle>
              <DialogDescription>
                Add a new project to your profile.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="built_for"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Built For</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter organization/client"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter project description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  {form.getValues("id") ? (
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting || isLoading}
                      isLoading={isLoading}
                      loadingText="Updating..."
                    >
                      {isLoading ? "Updating..." : "Update Project"}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting || isLoading}
                      isLoading={isLoading}
                      loadingText="Adding..."
                    >
                      {isLoading ? "Adding..." : "Add Project"}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects added yet</p>
            <p className="text-sm">Add your projects to showcase your work</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Built for: {project.built_for}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(project.start_date), "MMM yyyy")} -{" "}
                    {format(new Date(project.end_date), "MMM yyyy")}
                  </p>
                  {project.description && (
                    <p className="text-sm mt-2">{project.description}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      form.reset();
                      form.setValue("name", project.name);
                      form.setValue("built_for", project.built_for);
                      form.setValue("start_date", new Date(project.start_date));
                      form.setValue("end_date", new Date(project.end_date));
                      form.setValue("description", project.description);
                      form.setValue("id", project.id.toString());
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        Are you sure you want to delete this project?
                      </DialogDescription>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          isLoading={isLoading}
                          loadingText="Deleting..."
                          onClick={async () => {
                            setIsLoading(true);
                            await deleteProjectRecord(project.id.toString());
                            toast.success(
                              "Project record deleted successfully"
                            );
                            setIsLoading(false);
                            setDeleteDialogOpen(false);
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
