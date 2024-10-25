import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// GET - Fetch projectsDocs for a user
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectsDocs = await db.projectsDocs.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projectsDocs, { status: 200 });
  } catch (error) {
    console.error("[GET CODE SNIPPETS ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create a new projectsDocs
export async function POST(req: NextRequest) {
  try {
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

    const codeSnippet = await db.projectsDocs.create({
      data: {
        userId,
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

// PUT - Update a projectsDocs
export async function PUT(req: NextRequest) {
  try {
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

    const codeSnippet = await db.projectsDocs.findUnique({
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

    const updatedCodeSnippet = await db.projectsDocs.update({
      where: { id },
      data: {
        title,
        content,
        isEdited: true,
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

// DELETE - Remove a projectsDocs
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

    const codeSnippet = await db.projectsDocs.findUnique({
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

    await db.projectsDocs.delete({ where: { id } });

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
