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
import { Plus, Edit, Heart } from "lucide-react";
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

const interestFormSchema = z.object({
  name: z.string().min(1, "Interest name is required"),
});

type InterestFormValues = z.infer<typeof interestFormSchema>;

interface InterestCardProps {
  interests: Interest[];
}

export default function InterestCard({ interests }: InterestCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<InterestFormValues>({
    resolver: zodResolver(interestFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: InterestFormValues) => {
    console.log(data);
    setDialogOpen(false);
    form.reset();
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
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Interest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Interest</DialogTitle>
              <DialogDescription>
                Add a new interest to your profile.
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
                    {form.formState.isSubmitting ? "Adding..." : "Add Interest"}
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
                <Button size="sm" variant="ghost">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
