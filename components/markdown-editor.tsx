"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Markdown from "./markdown";
import { EditCodeSnippetDTO } from "@/features/api/code-snippets/use-edit-codesnippet";

export type CodeSnippetFormValues = z.infer<typeof formSchema>;

export type MarkdownEditorProps = {
  label: string;
  isLoading?: boolean;
  onSubmit: (values: EditCodeSnippetDTO) => void;
  initialValues?: EditCodeSnippetDTO;
};

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export default function MarkdownEditor({
  label,
  isLoading = false,
  onSubmit,
  initialValues,
}: MarkdownEditorProps) {
  const router = useRouter();

  const form = useForm<CodeSnippetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      title: "",
      content: "",
    },
  });

  // Use effect to update form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [form, initialValues]);

  const handleSubmit = async (values: EditCodeSnippetDTO) => {
    onSubmit(values);
  };

  const navigateToBack = () => {
    router.push("/code-snippets");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-start my-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={navigateToBack}
        >
          <ArrowBigLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <ScrollArea className="h-[500px] w-full rounded-md border">
              <div className="p-4">
                <TabsContent value="write">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (Markdown)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter content in markdown"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="prose dark:prose-invert">
                    <h2 className="text-2xl font-bold mb-4">
                      {form.watch("title")}
                    </h2>
                    <Markdown content={form.watch("content")} />
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : label}
            </Button>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
