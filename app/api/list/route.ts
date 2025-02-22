import envConfig from "@/lib/env";
import { NextResponse } from "next/server";

interface FileData {
  Key: string;
  Size: number;
  LastModified: string;
  SignedUrl: string;
}

interface GroupedFile {
  pathname: string;
  size: number;
  lastUpdate: string;
  downloadUrl: string;
  username: string;
}

export async function GET() {
  try {
    const response = await fetch(`${envConfig.serverAppUrl}/files`);
    if (!response.ok) {
      throw new Error("Failed to fetch files");
    }

    const data = await response.json();

    // Ensure files exists and is an array
    if (!Array.isArray(data?.files)) {
      return NextResponse.json({ groupedFiles: {} });
    }

    // Group files by username
    const groupedFiles = (data.files || []).reduce(
      (acc: { [username: string]: GroupedFile[] }, file: FileData) => {
        const [, username] = file.Key.split("/");
        if (!acc[username]) {
          acc[username] = [];
        }

        acc[username].push({
          pathname: file.Key,
          size: file.Size,
          lastUpdate: file.LastModified,
          downloadUrl: file.SignedUrl,
          username,
        });

        return acc;
      },
      {}
    );

    return NextResponse.json({ groupedFiles });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
