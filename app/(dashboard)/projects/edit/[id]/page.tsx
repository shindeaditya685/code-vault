"use client";

import { useGetProjectDoc } from "@/features/api/project-docs/use-get-project-doc";
import MarkdownEditor from "@/components/markdown-editor";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEditProjectDoc } from "@/features/api/project-docs/use-edit-project-doc";

export interface EditProjectDocs {
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
    data: project,
    isLoading,
    isError,
    error,
  } = useGetProjectDoc(params.id);

  console.log(params.id);

  const editMutation = useEditProjectDoc();

  const handleSubmit = async (values: EditProjectDocs) => {
    try {
      await editMutation.mutateAsync(values);
      toast({
        title: "Success!",
        description: "Code project updated successfully!",
      });
      router.push("/projects");
    } catch (error) {
      toast({
        title: "Failed!",
        description: "Failed to update code project",
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
            : "Failed to load Project docs"}
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500 mb-4">Project docs not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <MarkdownEditor
        key={project.id}
        label="Save Changes"
        onSubmit={handleSubmit}
        initialValues={{
          id: project.id,
          title: project.title,
          content: project.content,
        }}
        isLoading={editMutation.isPending}
      />
    </div>
  );
}
