import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { CodeSnippets } from "@prisma/client";

export type CreateCodeSnippetDTO = Pick<CodeSnippets, "title" | "content">;

const createCodeSnippet = async (
  data: CreateCodeSnippetDTO
): Promise<CodeSnippets> => {
  const response = await api.post<CodeSnippets>("/code-snippets", data);
  return response.data;
};

export const useCreateCodeSnippets = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCodeSnippet,
    onSuccess: () => {
      // Invalidate and refetch code snippets queries
      queryClient.invalidateQueries({ queryKey: ["codeSnippet"] });

      // Show success toast
      toast({
        title: "Success!",
        description: "Code snippet created successfully",
      });

      // Navigate back to the list
      router.push("/code-snippets");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create code snippet",
        variant: "destructive",
      });
    },
  });
};
