import envConfig from "@/lib/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const username = formData.get("username") as string;

  if (!file || !username) {
    return NextResponse.json(
      { error: "File and username are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${envConfig.serverAppUrl}/file/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "File uploaded successfully" });
}
