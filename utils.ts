import { HfInference } from "@huggingface/inference";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";

export class VectorEmbeddingService {
  private static instance: VectorEmbeddingService;
  private hf: HfInference;
  private pinecone: Pinecone;
  private indexName: string;
  private namespace: string;

  private constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    this.indexName = process.env.PINECONE_INDEX_NAME!;
    this.namespace = "code-snippets"; // You can make this configurable if needed
  }

  public static getInstance(): VectorEmbeddingService {
    if (!VectorEmbeddingService.instance) {
      VectorEmbeddingService.instance = new VectorEmbeddingService();
    }
    return VectorEmbeddingService.instance;
  }

  public async createEmbedding(text: string): Promise<number[]> {
    try {
      const embedding = await this.hf.featureExtraction({
        model: "mixedbread-ai/mxbai-embed-large-v1",
        inputs: text.replace(/\n/g, " "),
      });
      return Array.from(embedding);
    } catch (error) {
      console.error("[EMBEDDING CREATION ERROR]", error);
      throw new Error("Failed to create embedding");
    }
  }

  public async storeEmbedding<T extends Record<string, any>>({
    id,
    embedding,
    metadata,
  }: {
    id: string;
    embedding: number[];
    metadata: T;
  }): Promise<void> {
    try {
      const index = this.pinecone
        .Index(this.indexName)
        .namespace(this.namespace);

      const record: PineconeRecord = {
        id,
        values: embedding,
        metadata,
      };

      await index.upsert([record]);
    } catch (error) {
      console.error("[VECTOR DB STORAGE ERROR]", error);
      throw new Error("Failed to store in vector database");
    }
  }

  public async searchSimilar({
    queryText,
    filter,
    topK = 5,
  }: {
    queryText: string;
    filter?: Record<string, any>;
    topK?: number;
  }) {
    try {
      const queryEmbedding = await this.createEmbedding(queryText);

      const index = this.pinecone
        .Index(this.indexName)
        .namespace(this.namespace);

      const queryResponse = await index.query({
        vector: queryEmbedding,
        topK,
        filter,
        includeMetadata: true,
      });

      return queryResponse.matches;
    } catch (error) {
      console.error("[SIMILARITY SEARCH ERROR]", error);
      throw new Error("Failed to search similar items");
    }
  }
}
