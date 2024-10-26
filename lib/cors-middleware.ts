import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { MiddlewareFunction } from "../types/cors";

// Initialize cors configuration
const cors = Cors({
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: ["https://code-vault-phsy1cuom-shindeaditya685s-projects.vercel.app"],
  credentials: true,
}) as MiddlewareFunction;

export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: MiddlewareFunction
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: Error | null) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve();
    });
  });
}
