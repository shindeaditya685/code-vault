import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/lib/cors-middleware";
import Cors from "cors";
import { MiddlewareFunction } from "@/types/cors";

// Initialize cors with type safety
const cors = Cors({
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: ["https://code-vault-phsy1cuom-shindeaditya685s-projects.vercel.app"],
  credentials: true,
}) as MiddlewareFunction;

// Define your response type
interface ResponseData {
  message: string;
  // Add other properties as needed
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Run the middleware
    await runMiddleware(req, res, cors);

    // Handle the request based on method
    switch (req.method) {
      case "POST":
        // Your POST logic here
        return res.status(200).json({ message: "Success" });
      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
