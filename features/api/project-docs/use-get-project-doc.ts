import { useQuery } from "@tanstack/react-query";
import { ProjectsDocs } from "@prisma/client";
import axios from "axios";

const fetchProjectDocs = async (id: string): Promise<ProjectsDocs> => {
  const response = await axios.post("/api/projects-docs/get-by-id", { id });
  return response.data;
};

export const useGetProjectDoc = (id: string | undefined) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => fetchProjectDocs(id!),
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
