"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Edit, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useCreateBookmarks } from "@/features/api/bookmarks/use-create-bookmark";
import { useGetBookmarks } from "@/features/api/bookmarks/use-get-bookmars";
import { useEditBookmark } from "@/features/api/bookmarks/use-edit-bookmark";

type Bookmark = {
  id: string;
  title: string;
  link: string;
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Invalid URL"),
});

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const { toast } = useToast();
  const [id, setId] = useState<string>("");
  const mutation = useCreateBookmarks();

  const { data, isLoading } = useGetBookmarks();

  useEffect(() => {
    if (!isLoading && data) {
      setBookmarks(data);
    }
  }, [isLoading, data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
    },
  });

  const editMutation = useEditBookmark();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingBookmark) {
      const newValues = { ...values, id };
      editMutation.mutate(newValues);
      setEditingBookmark(null);
    } else {
      mutation.mutate(values);
    }
    form.reset();
    setShowAddForm(false);
    toast({
      title: editingBookmark ? "Bookmark updated" : "Bookmark added",
      description: `"${values.title}" has been ${
        editingBookmark ? "updated" : "added"
      } to your bookmarks.`,
    });
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link copied",
        description: "The bookmark link has been copied to your clipboard.",
      });
    });
  };

  const editBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setId(bookmark.id);
    form.reset(bookmark);
    setShowAddForm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingBookmark ? "Edit Bookmark" : "Add New Bookmark"}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                        <Input placeholder="Enter bookmark title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bookmark URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="submit" disabled={mutation.isPending}>
                    {editingBookmark ? "Update" : "Add"} Bookmark
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingBookmark(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{bookmark.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 truncate">{bookmark.link}</p>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{bookmark.title}</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <Input value={bookmark.link} readOnly />
                    <Button onClick={() => copyLink(bookmark.link)}>
                      Copy
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editBookmark(bookmark)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
