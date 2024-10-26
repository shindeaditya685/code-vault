import { NextApiResponse } from "next";

function setCorsHeaders(res: NextApiResponse) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://code-vault-phsy1cuom-shindeaditya685s-projects.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default setCorsHeaders;
