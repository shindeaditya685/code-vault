import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/* eslint-disable @typescript-eslint/no-explicit-any */
// /utils.ts

import { HfInference } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

interface PineconeMetadata {
  content: string;
  title: string;
}

export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  query: string
): Promise<string> {
  try {
    const apiOutput = await hf.featureExtraction({
      model: "mixedbread-ai/mxbai-embed-large-v1",
      inputs: query,
    });

    const queryEmbedding = Array.from(apiOutput);
    const index = client.Index(indexName);

    const queryResponse = await index.namespace(namespace).query({
      topK: 5,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: false,
    });

    console.log("Pinecone Response:", JSON.stringify(queryResponse, null, 2));

    if (queryResponse.matches && queryResponse.matches.length > 0) {
      const concatenatedRetrievals = queryResponse.matches
        .map((match, index) => {
          const metadata = match.metadata as PineconeMetadata;

          if (!metadata?.content) {
            console.warn(`No content found for match ${index}`);
            return null;
          }

          const score = (match.score * 100).toFixed(1);
          const title = metadata.title || "Untitled";

          // Don't wrap the content in additional code blocks since it already contains Markdown
          return `\nCode Vault Information ${
            index + 1
          } (${score}% match):\nTitle: ${title}\n${metadata.content}`;
        })
        .filter(Boolean) // Remove null entries
        .join("\n\n");

      return concatenatedRetrievals || "<no relevant information found>";
    }

    return "<no relevant information found>";
  } catch (error) {
    console.error("Error in queryPineconeVectorStore:", error);
    return "<no relevant information found>";
  }
}