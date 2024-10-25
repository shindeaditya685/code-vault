import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ProjectsDocs } from "@prisma/client";

export type CreateProjectDocsDTO = Pick<ProjectsDocs, "title" | "content">;

const createCodeSnippet = async (
  data: CreateProjectDocsDTO
): Promise<ProjectsDocs> => {
  const response = await api.post<ProjectsDocs>("/projects-docs", data);
  return response.data;
};

export const useCreateProjectDocs = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCodeSnippet,
    onSuccess: () => {
      // Invalidate and refetch code snippets queries
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      // Show success toast
      toast({
        title: "Success!",
        description: "Project Docs created successfully",
      });

      // Navigate back to the list
      router.push("/projects");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create Project Docs",
        variant: "destructive",
      });
    },
  });
};
