/* eslint-disable @typescript-eslint/no-unused-vars */

import { queryPineconeVectorStore } from "@/lib/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Message, StreamData, streamText } from "ai";

export const maxDuration = 60;

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? "",
});

const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY!,
});

const model = google("models/gemini-1.5-pro-latest", {
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

// Add this fallback information

const fallbackInfo = `You are a helpful AI assistant. The specific details requested by the user are unavailable, so use the provided fallback information to offer the most relevant response. Format your answer in Markdown for clarity.

\n\n**Response Guidelines:**
1. **General Overview**: Provide a general explanation based on the fallback information, using Markdown headings, bullet points, or numbered lists for organization.
2. **Code Snippets**: If the user requested code, offer an overview of a relevant solution or code concept, using code blocks (\`\`\`) if possible.
3. **Encouraging Tone**: If additional detail might be found elsewhere, kindly suggest resources or recommend follow-up queries.`;

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  console.log(reqBody);

  const messages: Message[] = reqBody.messages;
  const userQuestion = `${messages[messages.length - 1].content}`;

  const query = `Represent this for searching relevant information: ${userQuestion}`;

  const retrievals = await queryPineconeVectorStore(
    pinecone,
    process.env.PINECONE_INDEX_NAME!,
    "code-snippets",
    query
  );

  console.log("retrivals: ", retrievals);

  const finalPrompt = `You are a helpful AI assistant for Wadia College of Engineering's website, designed to assist users by providing project documentation, code snippets, or bookmarks/links, and explaining them clearly. Format all responses in Markdown for enhanced readability and structure.

\n\n**User Request:**\n${query}
\n**End of User Request**

\n\n**Relevant Information:**
\n\n${
    retrievals !== "<no relevant information found>" ? retrievals : fallbackInfo
  }

\n\n**Instructions for Answer Formatting:**
1. **Clear Explanations**: Provide concise and friendly explanations. Use Markdown headings (##), bullet points (-), or numbered lists to organize information.
2. **Code Snippets**: If sharing code, use Markdown code blocks (\`\`\`) with appropriate syntax highlighting for readability.
3. **Documentation**: For project documentation requests, present content in sections (e.g., Introduction, Objectives, Steps) with appropriate headers and formatting.
4. **Bookmarks/Links**: When asked for bookmarks or links, present each with a brief description and the correct Markdown link syntax ([Link Text](URL)).
5. **Missing Data**: If specific requested details are unavailable, provide general information and suggest other resources where applicable.

\n\n**Answer (in Markdown format):**
`;

  const data = new StreamData();

  data.append({
    retrievals: retrievals,
  });

  const result = await streamText({
    model: model,
    prompt: finalPrompt,
    onFinish() {
      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}
