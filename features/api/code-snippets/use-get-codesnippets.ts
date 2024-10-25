import { CodeSnippets } from "@prisma/client";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const fetchCodesnippets = async (): Promise<CodeSnippets> => {
  const response = await api.get<CodeSnippets>("/code-snippets");
  return response.data;
};

export const useGetCodesnippets = () => {
  return useQuery({
    queryKey: ["codeSnippet"],
    queryFn: fetchCodesnippets,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
