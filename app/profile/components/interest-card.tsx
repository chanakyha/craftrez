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
import { Plus, Edit, Heart, Trash2 } from "lucide-react";
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
  handleInterestRecord,
  updateInterestRecord,
  deleteInterestRecord,
} from "@/lib/actions";
import { toast } from "sonner";

const interestFormSchema = z.object({
  name: z.string().min(1, "Interest name is required"),
});

type InterestFormValues = z.infer<typeof interestFormSchema>;

interface InterestCardProps {
  interests: Interest[];
}

export default function InterestCard({ interests }: InterestCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
  const [deletingInterest, setDeletingInterest] = useState<Interest | null>(
    null
  );

  const form = useForm<InterestFormValues>({
    resolver: zodResolver(interestFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: InterestFormValues) => {
    try {
      if (editingInterest) {
        await updateInterestRecord(editingInterest.id.toString(), data);
        toast.success("Interest updated successfully!");
      } else {
        await handleInterestRecord(data);
        toast.success("Interest added successfully!");
      }
      setDialogOpen(false);
      setEditingInterest(null);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleEdit = (interest: Interest) => {
    setEditingInterest(interest);
    form.reset({
      name: interest.name,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (interest: Interest) => {
    setDeletingInterest(interest);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInterest) return;

    try {
      await deleteInterestRecord(deletingInterest.id.toString());
      toast.success("Interest deleted successfully!");
      setDeleteDialogOpen(false);
      setDeletingInterest(null);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setEditingInterest(null);
    form.reset({
      name: "",
    });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          <CardTitle>Interests</CardTitle>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingInterest ? "Edit Interest" : "Add Interest"}
              </DialogTitle>
              <DialogDescription>
                {editingInterest
                  ? "Edit the interest details."
                  : "Add a new interest to your profile."}
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
                      <FormLabel>Interest Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter interest name" {...field} />
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
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? editingInterest
                        ? "Updating..."
                        : "Adding..."
                      : editingInterest
                      ? "Update Interest"
                      : "Add Interest"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {interests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No interests added yet</p>
            <p className="text-sm">
              Add your interests to showcase your personality
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <div key={interest.id} className="flex items-center gap-2">
                <Badge variant="secondary">{interest.name}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(interest)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteClick(interest)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
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
              interest &ldquo;{deletingInterest?.name}&rdquo;.
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
