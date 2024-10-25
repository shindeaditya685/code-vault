"use client";

import MarkdownCard from "@/components/markdown-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetProjectDocs } from "@/features/api/project-docs/use-get-projectdocs";
import { ProjectsDocs } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const ProjectDocsPage = () => {
  const router = useRouter();
  const { data, isLoading } = useGetProjectDocs();
  const [projectDocs, setProjectDocs] = useState<ProjectsDocs[]>([]);

  useEffect(() => {
    if (!isLoading && Array.isArray(data)) {
      setProjectDocs(data);
    }
  }, [isLoading, data]);

  const navigateToCreate = () => {
    router.push("/projects/create");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Project Docs</h1>
        <Button
          className="w-full sm:w-auto text-black"
          onClick={navigateToCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="w-full h-[200px] cursor-pointer hover:shadow-lg transition-shadow flex flex-col animate-pulse "></Card>
          <Card className="w-full h-[200px] cursor-pointer hover:shadow-lg transition-shadow flex flex-col animate-pulse"></Card>
          <Card className="w-full h-[200px] cursor-pointer hover:shadow-lg transition-shadow flex flex-col animate-pulse"></Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projectDocs?.map((project) => (
            <MarkdownCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.content}
              pathname="projects"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDocsPage;
