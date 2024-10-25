import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { VectorEmbeddingService } from "@/utils";

// GET - Fetch bookmarks for a user
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await db.bookmarks.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error("[GET CODE SNIPPETS ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create a new bookmarks
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, link } = body;

    if (!title || !link) {
      return NextResponse.json(
        { error: "Title and link are required" },
        { status: 400 }
      );
    }

    const codeSnippet = await db.bookmarks.create({
      data: {
        userId,
        title,
        link,
      },
    });

    const vectorService = VectorEmbeddingService.getInstance();
    const combinedText = `${title} ${link}`;
    const embedding = await vectorService.createEmbedding(combinedText);

    await vectorService.storeEmbedding({
      id: codeSnippet.id,
      embedding,
      metadata: {
        title,
        link,
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

// PUT - Update a bookmarks
export async function PUT(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, link } = await req.json();

    if (!id || !title || !link) {
      return NextResponse.json(
        { error: "Id, title and link are required" },
        { status: 400 }
      );
    }

    const codeSnippet = await db.bookmarks.findUnique({
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

    const updatedCodeSnippet = await db.bookmarks.update({
      where: { id },
      data: {
        title,
        link,
        isEdited: true,
      },
    });

    const vectorService = VectorEmbeddingService.getInstance();
    const combinedText = `${title} ${link}`;
    const embedding = await vectorService.createEmbedding(combinedText);

    await vectorService.storeEmbedding({
      id: codeSnippet.id,
      embedding,
      metadata: {
        title,
        link,
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

// DELETE - Remove a bookmarks
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }

    const codeSnippet = await db.bookmarks.findUnique({
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

    await db.bookmarks.delete({ where: { id } });

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
