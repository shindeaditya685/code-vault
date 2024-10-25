import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import markdownit from "markdown-it";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Card } from "./ui/card";

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ""; // use external default escaping
  },
});

// Add custom renderer for Mermaid diagrams
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const code = token.content.trim();
  if (token.info.trim() === "mermaid") {
    return `<div class="mermaid">${code}</div>`;
  }
  return `<pre><code class="hljs language-${token.info.trim()}">${md.options.highlight(
    code,
    token.info
  )}</code></pre>`;
};

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const [mermaidInitialized, setMermaidInitialized] = useState(false);
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null); // Track which block is copied

  const copyToClipboard = (text: string, blockId: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedBlockId(blockId); // Set the copied block's ID
        setTimeout(() => {
          setCopiedBlockId(null); // Reset after 2 seconds
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    const initializeMermaid = async () => {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({ startOnLoad: false, theme: "dark" });
      setMermaidInitialized(true);
    };

    if (!mermaidInitialized) {
      initializeMermaid();
    }
  }, [mermaidInitialized]);

  useEffect(() => {
    if (containerRef.current && mermaidInitialized) {
      const codeBlocks = containerRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block, idx) => {
        if (!block.classList.contains("mermaid")) {
          const wrapper = document.createElement("div");
          wrapper.className = "relative";
          block.parentNode?.insertBefore(wrapper, block);
          wrapper.appendChild(block);

          if (path !== "/code-snippets/create") {
            const blockId = `block-${idx}`; // Unique ID for each code block
            const copyButton = document.createElement("button");

            React.createElement("div"); // Required for React to be aware of this change
            // Update button state with proper SVG icon
            copyButton.innerHTML =
              copiedBlockId === blockId ? `<p>Copied</p>` : `<p>Copy</p>`;

            copyButton.className =
              "absolute right-2 top-2 p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80";
            copyButton.addEventListener("click", () =>
              copyToClipboard(block.textContent || "", blockId)
            );
            wrapper.appendChild(copyButton);
          }
        }
      });

      // Render Mermaid diagrams
      import("mermaid").then(({ default: mermaid }) => {
        mermaid.run({
          nodes: containerRef.current.querySelectorAll(".mermaid"),
        });
      });
    }
  }, [content, path, mermaidInitialized, copiedBlockId]); // Add copiedBlockId to useEffect

  const html = md.render(content);
  const purifiedHtml = DOMPurify.sanitize(html);

  return (
    <Card className="p-4">
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: purifiedHtml }}
        className="prose dark:prose-invert max-w-none"
      />
    </Card>
  );
};

export default Markdown;
