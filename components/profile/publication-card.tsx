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
import { Plus, Edit, BookOpen, Trash2 } from "lucide-react";
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
  handlePublicationRecord,
  updatePublicationRecord,
  deletePublicationRecord,
} from "@/lib/actions";
import { toast } from "sonner";

const publicationFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  description: z.string().optional(),
});

type PublicationFormValues = z.infer<typeof publicationFormSchema>;

interface PublicationCardProps {
  publications: Publication[];
}

export default function PublicationCard({
  publications,
}: PublicationCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] =
    useState<Publication | null>(null);
  const [deletingPublication, setDeletingPublication] =
    useState<Publication | null>(null);

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      year: new Date().getFullYear(),
      description: "",
    },
  });

  const onSubmit = async (data: PublicationFormValues) => {
    try {
      if (editingPublication) {
        await updatePublicationRecord(editingPublication.id.toString(), data);
        toast.success("Publication updated successfully!");
      } else {
        await handlePublicationRecord(data);
        toast.success("Publication added successfully!");
      }
      setDialogOpen(false);
      setEditingPublication(null);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    form.reset({
      title: publication.title,
      author: publication.author,
      publisher: publication.publisher,
      year: publication.year,
      description: publication.description || "",
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (publication: Publication) => {
    setDeletingPublication(publication);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPublication) return;

    try {
      await deletePublicationRecord(deletingPublication.id.toString());
      toast.success("Publication deleted successfully!");
      setDeleteDialogOpen(false);
      setDeletingPublication(null);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setEditingPublication(null);
    form.reset({
      title: "",
      author: "",
      publisher: "",
      year: new Date().getFullYear(),
      description: "",
    });
    setDialogOpen(true);
  };

  return (
    <Card className="overflow-hidden border border-border/50 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Publications
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your research papers and published works
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
                {editingPublication ? "Edit Publication" : "Add Publication"}
              </DialogTitle>
              <DialogDescription>
                {editingPublication
                  ? "Edit the publication details."
                  : "Add a new publication to your profile."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter publication title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publisher</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter publisher name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter publication year"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : new Date().getFullYear()
                            )
                          }
                        />
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
                          placeholder="Enter publication description"
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
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? editingPublication
                        ? "Updating..."
                        : "Adding..."
                      : editingPublication
                      ? "Update Publication"
                      : "Add Publication"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {publications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No publications added yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your publications to showcase your research and academic work
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {publications.map((publication) => (
              <div
                key={publication.id}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 hover:shadow-sm hover:border-primary/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mt-1">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                            {publication.title}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Author: {publication.author}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Publisher: {publication.publisher}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Year: {publication.year}
                            </p>
                            {publication.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed mt-3 p-3 bg-muted/30 rounded-lg">
                                {publication.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(publication)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(publication)}
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
              publication &ldquo;{deletingPublication?.title}&rdquo;.
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
