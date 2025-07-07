"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Edit, GraduationCap, Trash2 } from "lucide-react";
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
  handleEducationRecord,
  updateEducationRecord,
  deleteEducationRecord,
} from "@/lib/actions";
import { toast } from "sonner";

// Education Form Schema
const educationFormSchema = z.object({
  id: z.string().optional(),
  school_name: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  place: z.string().min(1, "Place is required"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  marks: z
    .number({
      required_error: "Marks is required",
    })
    .min(0, "Marks must be greater than 0"),
  marksOutof: z
    .number({
      required_error: "Marks out of is required",
    })
    .min(0, "Marks out of must be greater than 0"),
});

type EducationFormValues = z.infer<typeof educationFormSchema>;

interface EducationCardProps {
  educations: Education[];
}

export default function EducationCard({ educations }: EducationCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingEducation, setDeletingEducation] = useState<Education | null>(
    null
  );

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      id: undefined,
      school_name: "",
      degree: "",
      place: "",
      start_date: new Date(),
      end_date: new Date(),
      marks: undefined,
      marksOutof: undefined,
    },
  });

  const onSubmit = async (data: EducationFormValues) => {
    try {
      setIsLoading(true);
      if (data.id) {
        await updateEducationRecord(data.id, data as unknown as Education);
      } else {
        await handleEducationRecord(data as unknown as Education);
      }
      setDialogOpen(false);
      setIsLoading(false);
      form.reset();
      toast.success(
        data.id
          ? "Education record updated successfully"
          : "Education record added successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        data.id
          ? "Failed to update education record"
          : "Failed to add education record"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (education: Education) => {
    setDeletingEducation(education);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEducation) return;

    try {
      setIsLoading(true);
      await deleteEducationRecord(deletingEducation.id.toString());
      toast.success("Education record deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingEducation(null);
    } catch (error) {
      console.error(error);
      toast.error("Education record not deleted");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-border/50 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Education
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your academic background and qualifications
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setDialogOpen(true)}
              className="hover:bg-primary/10 hover:border-primary/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Education</DialogTitle>
              <DialogDescription>
                Add a new education record to your profile.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="school_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter degree" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter place" {...field} />
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marks</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Marks obtained"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marksOutof"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Out of</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Total marks"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                      Update Education
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting || isLoading}
                      isLoading={isLoading}
                      loadingText="Adding..."
                    >
                      Add Education
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {educations.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No education added yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your educational background to showcase your academic journey
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {educations.map((education) => (
              <div
                key={education.id}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 hover:shadow-sm hover:border-primary/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mt-1">
                          <GraduationCap className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                            {education.degree}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              {education.school_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {education.place}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>
                                {format(
                                  new Date(education.start_date),
                                  "MMM yyyy"
                                )}{" "}
                                -{" "}
                                {format(
                                  new Date(education.end_date),
                                  "MMM yyyy"
                                )}
                              </span>
                            </div>
                            {education.marks && education.marksOutof && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">
                                  Marks:
                                </span>
                                <span className="font-medium text-primary">
                                  {education.marks}/{education.marksOutof}
                                </span>
                                <span className="text-muted-foreground">
                                  (
                                  {Math.round(
                                    (education.marks / education.marksOutof) *
                                      100
                                  )}
                                  %)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setDialogOpen(true);
                          form.reset();
                          form.setValue("school_name", education.school_name);
                          form.setValue("degree", education.degree);
                          form.setValue("place", education.place);
                          form.setValue(
                            "start_date",
                            new Date(education.start_date)
                          );
                          form.setValue(
                            "end_date",
                            new Date(education.end_date)
                          );
                          form.setValue("marks", education.marks || 0);
                          form.setValue(
                            "marksOutof",
                            education.marksOutof || 0
                          );
                          form.setValue("id", education.id.toString());
                        }}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteClick(education)}
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
              education record for &ldquo;{deletingEducation?.degree}&rdquo; at
              &ldquo;{deletingEducation?.school_name}&rdquo;.
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
