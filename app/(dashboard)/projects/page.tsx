"use client";

import MarkdownCard from "@/components/markdown-card";
import { Button } from "@/components/ui/button";
import { useGetProjectDocs } from "@/features/project-docs/use-get-projectdocs";
import { ProjectsDocs } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProjectPage = () => {
  const router = useRouter();
  const { data, isLoading } = useGetProjectDocs();
  const [snippets, setSnippets] = useState<ProjectsDocs[]>([]);

  useEffect(() => {
    if (!isLoading && data) {
      setSnippets(data);
    }
  }, [isLoading, data]);

  const navigateToCreate = () => {
    router.push("/projects/create");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button
          className="w-full sm:w-auto text-black"
          onClick={navigateToCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Docs
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {snippets.map((snippet) => (
          <MarkdownCard
            key={snippet.id}
            id={snippet.id}
            title={snippet.title}
            description={snippet.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectPage;
