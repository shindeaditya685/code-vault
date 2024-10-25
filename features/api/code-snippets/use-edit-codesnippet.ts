import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { CodeSnippets } from "@prisma/client";

export type EditCodeSnippetDTO = {
  id: string;
  title: string;
  content: string;
};

const editCodesnippet = async (
  data: EditCodeSnippetDTO
): Promise<CodeSnippets> => {
  const response = await api.put<CodeSnippets>("/code-snippets", data);
  return response.data;
};

export const useEditCodesnippet = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editCodesnippet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["codeSnippet"] });

      // Show success toast
      toast({
        title: "Success!",
        description: "Bookmark edited successfully",
      });

      // Navigate back to the list
      router.push("/code-snippets");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to edit Bookmark",
        variant: "destructive",
      });
    },
  });
};
