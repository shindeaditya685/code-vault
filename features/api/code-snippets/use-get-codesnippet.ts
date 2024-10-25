import api from "@/lib/api";
import { CodeSnippets } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";



const fetchCodesnippet = async (id: string): Promise<CodeSnippets> => {
  const response = await api.post(
    "/code-snippets/get-by-id",
    { id },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useGetCodesnippet = (id: string) => {
  return useQuery<CodeSnippets>({
    queryKey: ["codeSnippet"],
    queryFn: () => fetchCodesnippet(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
