import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Bookmarks } from "@prisma/client";

export type EditLinkDTO = Pick<Bookmarks, "title" | "link">;

const editBookmark = async (data: EditLinkDTO): Promise<Bookmarks> => {
  const response = await api.put<Bookmarks>("/bookmarks", data);
  return response.data;
};

export const useEditBookmark = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });

      // Show success toast
      toast({
        title: "Success!",
        description: "Bookmark edited successfully",
      });

      // Navigate back to the list
      router.push("/bookmarks");
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
