"use client";

import MarkdownCard from "@/components/markdown-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetCodesnippets } from "@/features/api/code-snippets/use-get-codesnippets";
import { CodeSnippets } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const CodeSnippetsPage = () => {
  const router = useRouter();
  const { data, isLoading } = useGetCodesnippets();
  const [snippets, setSnippets] = useState<CodeSnippets[]>([]);

  useEffect(() => {
    if (!isLoading && Array.isArray(data)) {
      setSnippets(data);
    }
  }, [isLoading, data]);

  const navigateToCreate = () => {
    router.push("/code-snippets/create");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Code Snippets</h1>
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
          {snippets?.map((snippet) => (
            <MarkdownCard
              key={snippet.id}
              id={snippet.id}
              title={snippet.title}
              description={snippet.content}
              pathname="code-snippets"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeSnippetsPage;
