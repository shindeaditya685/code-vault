import { NextApiRequest, NextApiResponse } from "next";

export type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: (result: Error | null) => void
) => void;
