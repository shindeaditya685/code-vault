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

export async function POST(req: Request) {
  const reqBody = await req.json();
  console.log("Request Body:", reqBody);

  const messages: Message[] = reqBody.messages;
  const userQuestion = messages[messages.length - 1].content;

  try {
    const retrievals = await queryPineconeVectorStore(
      pinecone,
      process.env.PINECONE_INDEX_NAME!,
      "code-snippets",
      userQuestion // Using the direct question for better search relevance
    );

    console.log("Retrievals:", retrievals);

    const finalPrompt = `You are a helpful AI assistant for Wadia College of Engineering's website. You should explain code snippets, documentation, and provide helpful context.

User Question: ${userQuestion}

Retrieved Information:
${retrievals !== "<no relevant information found>" ? retrievals : fallbackInfo}

Instructions:
1. If code is present in the retrieved information, explain what it does and how to use it
2. Include any important implementation details or requirements
3. Suggest best practices related to the implementation
4. If the retrieved code is partial, mention what else might be needed
5. Format your response in Markdown for readability

Response:`;

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
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
