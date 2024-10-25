import { Bookmarks } from "@prisma/client";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const fetchBookmarks = async (): Promise<Bookmarks> => {
  const response = await api.get<Bookmarks>("/bookmarks");
  return response.data;
};

export const useGetBookmarks = () => {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
