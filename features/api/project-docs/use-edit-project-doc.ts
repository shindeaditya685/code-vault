import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ProjectsDocs } from "@prisma/client";

export type EditProjectDocsDTO = {
  id: string;
  title: string;
  content: string;
};

const editProjectDoc = async (
  data: EditProjectDocsDTO
): Promise<ProjectsDocs> => {
  const response = await api.put<ProjectsDocs>("/projects-docs", data);
  return response.data;
};

export const useEditProjectDoc = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editProjectDoc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Show success toast
      toast({
        title: "Success!",
        description: "Project edited successfully",
      });

      // Navigate back to the list
      router.push("/projects");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to edit Project.",
        variant: "destructive",
      });
    },
  });
};
