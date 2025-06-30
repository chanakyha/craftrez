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
import { Plus, Edit, Globe, Trash2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  handleLanguageRecord,
  updateLanguageRecord,
  deleteLanguageRecord,
} from "@/lib/actions";
import { toast } from "sonner";

const languageFormSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  proficiency: z.string().min(1, "Proficiency level is required"),
});

type LanguageFormValues = z.infer<typeof languageFormSchema>;

interface LanguageCardProps {
  languages: Language[];
}

const proficiencyLevels = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Upper Intermediate",
  "Advanced",
  "Native/Fluent",
];

export default function LanguageCard({ languages }: LanguageCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [deletingLanguage, setDeletingLanguage] = useState<Language | null>(
    null
  );

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      name: "",
      proficiency: "",
    },
  });

  const onSubmit = async (data: LanguageFormValues) => {
    try {
      if (editingLanguage) {
        await updateLanguageRecord(editingLanguage.id.toString(), data);
        toast.success("Language updated successfully!");
      } else {
        await handleLanguageRecord(data);
        toast.success("Language added successfully!");
      }
      setDialogOpen(false);
      setEditingLanguage(null);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleEdit = (language: Language) => {
    setEditingLanguage(language);
    form.reset({
      name: language.name,
      proficiency: language.proficiency,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (language: Language) => {
    setDeletingLanguage(language);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLanguage) return;

    try {
      await deleteLanguageRecord(deletingLanguage.id.toString());
      toast.success("Language deleted successfully!");
      setDeleteDialogOpen(false);
      setDeletingLanguage(null);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setEditingLanguage(null);
    form.reset({
      name: "",
      proficiency: "",
    });
    setDialogOpen(true);
  };

  return (
    <Card className="overflow-hidden border border-border/50 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Languages
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your language proficiencies
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
                {editingLanguage ? "Edit Language" : "Add Language"}
              </DialogTitle>
              <DialogDescription>
                {editingLanguage
                  ? "Edit the language details."
                  : "Add a new language to your profile."}
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
                      <FormLabel>Language Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter language name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select proficiency level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proficiencyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      ? editingLanguage
                        ? "Updating..."
                        : "Adding..."
                      : editingLanguage
                      ? "Update Language"
                      : "Add Language"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {languages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No languages added yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your languages to showcase your communication skills
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {languages.map((language) => (
              <div
                key={language.id}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 hover:shadow-sm hover:border-primary/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mt-1">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                            {language.name}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Proficiency: {language.proficiency}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(language)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(language)}
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
              language &ldquo;{deletingLanguage?.name}&rdquo;.
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
