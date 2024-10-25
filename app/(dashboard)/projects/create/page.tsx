"use client";

import MarkdownEditor from "@/components/markdown-editor";
import {
  CreateProjectDocsDTO,
  useCreateProjectDocs,
} from "@/features/project-docs/use-create-project-docs";

const CreatePage = () => {
  const mutation = useCreateProjectDocs();

  const handleSubmit = async (values: CreateProjectDocsDTO) => {
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
