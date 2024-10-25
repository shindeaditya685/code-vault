import ChatComponent from "@/components/chat-component";
import React from "react";

const AIChatPage = () => {
  return (
    <main className="flex-1 overflow-auto p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <ChatComponent />
      </div>
    </main>
  );
};

export default AIChatPage;
