"use client";

import MarkdownEditor from "@/components/markdown-editor";
import { useCreateCodeSnippets } from "@/features/api/code-snippets/use-create-codesnippet";
import { CreateCodeSnippetDTO } from "@/features/api/code-snippets/use-create-codesnippet";

const CreatePage = () => {
  const mutation = useCreateCodeSnippets();

  const handleSubmit = async (values: CreateCodeSnippetDTO) => {
    mutation.mutate(values);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <MarkdownEditor
        label="Save"
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
      />
    </div>
  );
};

export default CreatePage;
