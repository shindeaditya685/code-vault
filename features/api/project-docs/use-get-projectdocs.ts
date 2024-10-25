import { ProjectsDocs } from "@prisma/client";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const fetchProjectDocs = async (): Promise<ProjectsDocs> => {
  const response = await api.get<ProjectsDocs>("/projects-docs");
  return response.data;
};

export const useGetProjectDocs = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjectDocs,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
