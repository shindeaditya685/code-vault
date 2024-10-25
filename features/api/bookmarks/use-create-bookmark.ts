import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Bookmarks } from "@prisma/client";

export type CreateLinkDTO = Pick<Bookmarks, "title" | "link">;

const createBookmark = async (data: CreateLinkDTO): Promise<Bookmarks> => {
  const response = await api.post<Bookmarks>("/bookmarks", data);
  return response.data;
};

export const useCreateBookmarks = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });

      // Show success toast
      toast({
        title: "Success!",
        description: "Bookmark created successfully",
      });

      // Navigate back to the list
      router.push("/bookmarks");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create Bookmark",
        variant: "destructive",
      });
    },
  });
};
