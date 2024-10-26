/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { VectorEmbeddingService } from "@/utils";
import { runMiddleware } from "@/lib/cors-middleware";
import { MiddlewareFunction } from "@/types/cors";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: ["https://code-vault-phsy1cuom-shindeaditya685s-projects.vercel.app"],
  credentials: true,
}) as MiddlewareFunction;

// GET - Fetch code snippets for a user
export async function GET(req: NextRequest) {
  try {
    const response = new NextResponse();
    await runMiddleware(req as any, response as any, cors);
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const codeSnippets = await db.codeSnippets.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(codeSnippets, { status: 200 });
  } catch (error) {
    console.error("[GET CODE SNIPPETS ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create a new code snippet
export async function POST(req: NextRequest) {
  try {
    const response = new NextResponse();
    await runMiddleware(req as any, response as any, cors);

    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const codeSnippet = await db.codeSnippets.create({
      data: {
        userId,
        title,
        content,
      },
    });

    const vectorService = VectorEmbeddingService.getInstance();
    const combinedText = `${title} ${content}`;
    const embedding = await vectorService.createEmbedding(combinedText);

    await vectorService.storeEmbedding({
      id: codeSnippet.id,
      embedding,
      metadata: {
        title,
        content,
      },
    });

    return NextResponse.json(codeSnippet, { status: 201 });
  } catch (error) {
    console.error("[POST CODE SNIPPET ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update a code snippet
export async function PUT(req: NextRequest) {
  try {
    const response = new NextResponse();
    await runMiddleware(req as any, response as any, cors);
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, content } = await req.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "Id, title and content are required" },
        { status: 400 }
      );
    }

    const codeSnippet = await db.codeSnippets.findUnique({
      where: { id },
    });

    if (!codeSnippet) {
      return NextResponse.json(
        { error: "Code snippet not found" },
        { status: 404 }
      );
    }

    if (userId !== codeSnippet.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedCodeSnippet = await db.codeSnippets.update({
      where: { id },
      data: {
        title,
        content,
        isEdited: true,
      },
    });

    const vectorService = VectorEmbeddingService.getInstance();
    const combinedText = `${title} ${content}`;
    const embedding = await vectorService.createEmbedding(combinedText);

    await vectorService.storeEmbedding({
      id: codeSnippet.id,
      embedding,
      metadata: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedCodeSnippet, { status: 200 });
  } catch (error) {
    console.error("[UPDATE CODE SNIPPET ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a code snippet
export async function DELETE(req: NextRequest) {
  try {
    const response = new NextResponse();
    await runMiddleware(req as any, response as any, cors);
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }

    const codeSnippet = await db.codeSnippets.findUnique({
      where: { id },
    });

    if (!codeSnippet) {
      return NextResponse.json(
        { error: "Code snippet not found" },
        { status: 404 }
      );
    }

    if (userId !== codeSnippet.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.codeSnippets.delete({ where: { id } });

    return NextResponse.json(
      { message: "Code snippet deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE CODE SNIPPET ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
