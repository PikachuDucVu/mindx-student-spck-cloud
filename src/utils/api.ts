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

export const FetchFilesList = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_APP_URL}/files`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch files");
    }

    const data = await response.json();

    // Ensure files exists and is an array
    if (!Array.isArray(data?.files)) {
      // return NextResponse.json({ groupedFiles: {} });
      return { groupedFiles: {} };
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

    return { groupedFiles };
  } catch (error) {
    console.error("Error listing files:", error);
    // return NextResponse.json(
    //   { error: "Failed to list files" },
    //   { status: 500 }
    // );
    throw new Error("Failed to list files");
  }
};
