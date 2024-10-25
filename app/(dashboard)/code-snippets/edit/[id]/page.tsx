"use client";

import { useGetCodeSnippet } from "@/features/api/code-snippets/use-get-codesnippet";
import MarkdownEditor from "@/components/markdown-editor";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEditCodesnippet } from "@/features/api/code-snippets/use-edit-codesnippet";
import { useToast } from "@/hooks/use-toast";

export interface EditCodeSnippetDTO {
  id: string;
  title: string;
  content: string;
}

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const { toast } = useToast();

  const {
    data: snippet,
    isLoading,
    isError,
    error,
  } = useGetCodeSnippet(params.id);

  const editMutation = useEditCodesnippet();

  const handleSubmit = async (values: EditCodeSnippetDTO) => {
    try {
      await editMutation.mutateAsync(values);
      toast({
        title: "Success!",
        description: "Code snippet updated successfully!",
      });
      router.push("/code-snippets");
    } catch (error) {
      toast({
        title: "Failed!",
        description: "Failed to update code snippet",
        variant: "destructive",
      });
      console.error("Update error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4">
          {error instanceof Error
            ? error.message
            : "Failed to load code snippet"}
        </p>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500 mb-4">Code snippet not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <MarkdownEditor
        key={snippet.id}
        label="Save Changes"
        onSubmit={handleSubmit}
        initialValues={{
          id: snippet.id,
          title: snippet.title,
          content: snippet.content,
        }}
        isLoading={editMutation.isPending}
      />
    </div>
  );
}
