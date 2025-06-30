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
import { Plus, Edit, Trophy, Trash2 } from "lucide-react";
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
  handleAchievementRecord,
  updateAchievementRecord,
  deleteAchievementRecord,
} from "@/lib/actions";
import { toast } from "sonner";

const achievementFormSchema = z.object({
  name: z.string().min(1, "Achievement name is required"),
  position: z.string().min(1, "Position is required"),
  place: z.string().min(1, "Place is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.date({
    required_error: "Date is required",
  }),
});

type AchievementFormValues = z.infer<typeof achievementFormSchema>;

interface AchievementCardProps {
  achievements: Achievement[];
}

export default function AchievementCard({
  achievements,
}: AchievementCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [deletingAchievement, setDeletingAchievement] =
    useState<Achievement | null>(null);

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      name: "",
      position: "",
      place: "",
      issuer: "",
      date: new Date(),
    },
  });

  const onSubmit = async (data: AchievementFormValues) => {
    try {
      if (editingAchievement) {
        await updateAchievementRecord(editingAchievement.id.toString(), data);
        toast.success("Achievement updated successfully!");
      } else {
        await handleAchievementRecord(data);
        toast.success("Achievement added successfully!");
      }
      setDialogOpen(false);
      setEditingAchievement(null);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    form.reset({
      name: achievement.name,
      position: achievement.position,
      place: achievement.place,
      issuer: achievement.issuer,
      date: new Date(achievement.date),
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (achievement: Achievement) => {
    setDeletingAchievement(achievement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAchievement) return;

    try {
      await deleteAchievementRecord(deletingAchievement.id.toString());
      toast.success("Achievement deleted successfully!");
      setDeleteDialogOpen(false);
      setDeletingAchievement(null);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setEditingAchievement(null);
    form.reset({
      name: "",
      position: "",
      place: "",
      issuer: "",
      date: new Date(),
    });
    setDialogOpen(true);
  };

  return (
    <Card className="overflow-hidden border border-border/50 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Achievements
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your awards, honors, and accomplishments
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
                {editingAchievement ? "Edit Achievement" : "Add Achievement"}
              </DialogTitle>
              <DialogDescription>
                {editingAchievement
                  ? "Edit the achievement details."
                  : "Add a new achievement to your profile."}
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
                      <FormLabel>Achievement Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter achievement name"
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
                <FormField
                  control={form.control}
                  name="issuer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter issuer" {...field} />
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
                      ? editingAchievement
                        ? "Updating..."
                        : "Adding..."
                      : editingAchievement
                      ? "Update Achievement"
                      : "Add Achievement"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No achievements added yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your achievements to showcase your awards and accomplishments
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 hover:shadow-sm hover:border-primary/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mt-1">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                            {achievement.name}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Position: {achievement.position}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Place: {achievement.place}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Issuer: {achievement.issuer}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(achievement.date), "MMM yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(achievement)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(achievement)}
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
              achievement &ldquo;{deletingAchievement?.name}&rdquo;.
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
