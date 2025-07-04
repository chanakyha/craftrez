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
import { Plus, Edit, Briefcase, Trash2 } from "lucide-react";
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
  deleteExperienceRecord,
  handleExperienceRecord,
  updateExperienceRecord,
} from "@/lib/actions";
import { toast } from "sonner";

// Experience Form Schema
const experienceFormSchema = z.object({
  id: z.string().optional(),
  company_name: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  description: z.string().optional(),
  place: z.string().min(1, "Place is required"),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

interface ExperienceCardProps {
  experiences: Experience[];
}

export default function ExperienceCard({ experiences }: ExperienceCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingExperience, setDeletingExperience] =
    useState<Experience | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      id: undefined,
      company_name: "",
      position: "",
      start_date: new Date(),
      end_date: new Date(),
      description: "",
      place: "",
    },
  });

  const onSubmit = async (data: ExperienceFormValues) => {
    try {
      setIsLoading(true);
      if (data.id) {
        await updateExperienceRecord(data.id, data as unknown as Experience);
        toast.success("Experience record updated successfully");
      } else {
        await handleExperienceRecord(data as unknown as Experience);
        toast.success("Experience record added successfully");
      }
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(
        data.id
          ? "Experience record update failed"
          : "Experience record addition failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (experience: Experience) => {
    setDeletingExperience(experience);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExperience) return;

    try {
      setIsLoading(true);
      await deleteExperienceRecord(deletingExperience.id.toString());
      toast.success("Experience record deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingExperience(null);
    } catch (error) {
      console.error(error);
      toast.error("Experience record not deleted");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    form.reset();
    setDialogOpen(true);
  };

  return (
    <Card className="overflow-hidden border border-border/50 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Experience
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your work history and professional experience
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
                {form.getValues("id") ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
              <DialogDescription>
                {form.getValues("id")
                  ? "Edit the experience details."
                  : "Add a new work experience to your profile."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter position" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                  name="place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter job description"
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
                      Update Experience
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting || isLoading}
                      isLoading={isLoading}
                      loadingText="Adding..."
                    >
                      Add Experience
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No experience added yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your work experience to showcase your professional journey
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 hover:shadow-sm hover:border-primary/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mt-1">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                            {experience.position}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">
                              {experience.company_name}
                            </span>
                            <span>•</span>
                            <span>{experience.place}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              {format(
                                new Date(experience.start_date),
                                "MMM yyyy"
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(experience.end_date),
                                "MMM yyyy"
                              )}
                            </span>
                          </div>
                          {experience.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed mt-3 p-3 bg-muted/30 rounded-lg">
                              {experience.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          form.reset();
                          form.setValue("id", experience.id.toString());
                          form.setValue(
                            "company_name",
                            experience.company_name
                          );
                          form.setValue("position", experience.position);
                          form.setValue(
                            "start_date",
                            new Date(experience.start_date)
                          );
                          form.setValue(
                            "end_date",
                            new Date(experience.end_date)
                          );
                          form.setValue("description", experience.description);
                          form.setValue("place", experience.place);
                          setDialogOpen(true);
                        }}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteClick(experience)}
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
              experience record for &ldquo;{deletingExperience?.position}&rdquo;
              at &ldquo;{deletingExperience?.company_name}&rdquo;.
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
