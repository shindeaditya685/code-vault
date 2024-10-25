import { useQuery } from "@tanstack/react-query";
import { CodeSnippets } from "@prisma/client";
import axios from "axios";

const fetchCodeSnippet = async (id: string): Promise<CodeSnippets> => {
  const response = await axios.post("/api/code-snippets/get-by-id", { id });
  return response.data;
};

export const useGetCodeSnippet = (id: string | undefined) => {
  return useQuery({
    queryKey: ["codeSnippet", id],
    queryFn: () => fetchCodeSnippet(id!),
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
