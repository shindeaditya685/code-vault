import React from "react";

const Page = () => {
  return (
    <>
      {/* Code Snippets Section */}
      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Code Snippets</h2>
        {/* Add your code snippets list here */}
      </div>

      {/* Projects Section */}
      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-4">Current Projects</h2>
        {/* Add your projects list here */}
      </div>

      {/* AI Chat Section */}
      <div className="lg:col-span-2 rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-4">AI Chat</h2>
        {/* Add your AI chat interface here */}
      </div>
    </>
  );
};

export default Page;
