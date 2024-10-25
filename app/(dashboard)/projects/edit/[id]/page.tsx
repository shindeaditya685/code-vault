"use client";

import React from "react";
import MarkdownEditor from "@/components/markdown-editor";

const EditPage = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <MarkdownEditor label={"Edit"} />
    </div>
  );
};
export default EditPage;
