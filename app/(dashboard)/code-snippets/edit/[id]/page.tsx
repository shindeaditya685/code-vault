"use client";

import React from "react";
import MarkdownEditor from "@/components/markdown-editor";
import { useGetCodesnippet } from "@/features/api/code-snippets/use-get-codesnippet";
import {
  EditCodeSnippetDTO,
  useEditCodesnippet,
} from "@/features/api/code-snippets/use-edit-codesnippet";

type Props = {
  params: {
    id: string;
  };
};

const EditPage = ({ params }: Props) => {

  if (!params.id) {
    <div>Loading...</div>
  }

  const { data, isPending, isLoading } = useGetCodesnippet(params.id);
  const mutation = useEditCodesnippet();

  const handleSubmit = async (values: EditCodeSnippetDTO) => {
    mutation.mutate(values);
  };

  // Transform data to match the expected shape
  const initialValues = data
    ? {
        id: params.id,
        title: data.title,
        content: data.content,
      }
    : undefined;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {isPending && isLoading ? (
        <div>Loading...</div>
      ) : (
        <MarkdownEditor
          key={params.id} // Add key to force remount when id changes
          label="Edit"
          onSubmit={handleSubmit}
          initialValues={initialValues}
          isLoading={mutation.isPending}
        />
      )}
    </div>
  );
};

export default EditPage;
