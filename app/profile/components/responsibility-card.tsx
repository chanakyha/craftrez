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
import { Plus, Edit, Users, Trash2 } from "lucide-react";
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
  handleResponsibilityRecord,
  updateResponsibilityRecord,
  deleteResponsibilityRecord,
} from "@/lib/actions";
import { toast } from "sonner";

const responsibilityFormSchema = z.object({
  name: z.string().min(1, "Responsibility name is required"),
  position: z.string().min(1, "Position is required"),
  type: z.string().min(1, "Type is required"),
  date: z.date({
    required_error: "Date is required",
  }),
});

type ResponsibilityFormValues = z.infer<typeof responsibilityFormSchema>;

interface ResponsibilityCardProps {
  responsibilities: Responsibility[];
}

export default function ResponsibilityCard({
  responsibilities,
}: ResponsibilityCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingResponsibility, setEditingResponsibility] =
    useState<Responsibility | null>(null);
  const [deletingResponsibility, setDeletingResponsibility] =
    useState<Responsibility | null>(null);

  const form = useForm<ResponsibilityFormValues>({
    resolver: zodResolver(responsibilityFormSchema),
    defaultValues: {
      name: "",
      position: "",
      type: "",
      date: new Date(),
    },
  });

  const onSubmit = async (data: ResponsibilityFormValues) => {
    try {
      if (editingResponsibility) {
        await updateResponsibilityRecord(
          editingResponsibility.id.toString(),
          data
        );
        toast.success("Responsibility updated successfully!");
      } else {
        await handleResponsibilityRecord(data);
        toast.success("Responsibility added successfully!");
      }
      setDialogOpen(false);
      setEditingResponsibility(null);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleEdit = (responsibility: Responsibility) => {
    setEditingResponsibility(responsibility);
    form.reset({
      name: responsibility.name,
      position: responsibility.position,
      type: responsibility.type,
      date: new Date(responsibility.date),
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (responsibility: Responsibility) => {
    setDeletingResponsibility(responsibility);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingResponsibility) return;

    try {
      await deleteResponsibilityRecord(deletingResponsibility.id.toString());
      toast.success("Responsibility deleted successfully!");
      setDeleteDialogOpen(false);
      setDeletingResponsibility(null);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setEditingResponsibility(null);
    form.reset({
      name: "",
      position: "",
      type: "",
      date: new Date(),
    });
    setDialogOpen(true);
  };

  return (
    <Card className="overflow-hidden border border-border/50 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Responsibilities
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your leadership roles and organizational duties
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
                {editingResponsibility
                  ? "Edit Responsibility"
                  : "Add Responsibility"}
              </DialogTitle>
              <DialogDescription>
                {editingResponsibility
                  ? "Edit the responsibility details."
                  : "Add a new responsibility to your profile."}
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
                      <FormLabel>Responsibility Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter responsibility name"
                          {...field}
                        />
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
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter responsibility type"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
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
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? editingResponsibility
                        ? "Updating..."
                        : "Adding..."
                      : editingResponsibility
                      ? "Update Responsibility"
                      : "Add Responsibility"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {responsibilities.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No responsibilities added yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your responsibilities to showcase your leadership roles
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {responsibilities.map((responsibility) => (
              <div
                key={responsibility.id}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 hover:shadow-sm hover:border-primary/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mt-1">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                            {responsibility.name}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Position: {responsibility.position}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Type: {responsibility.type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(
                                new Date(responsibility.date),
                                "MMM yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(responsibility)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(responsibility)}
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
              responsibility &ldquo;{deletingResponsibility?.name}&rdquo;.
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
