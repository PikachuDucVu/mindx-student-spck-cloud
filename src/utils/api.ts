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
      return { groupedSpckFiles: {}, groupedTestFiles: {} };
    }

    // Separate files starting with spck/ and test/
    const spckFiles = data.files.filter((file: FileData) =>
      file.Key.startsWith("spck/")
    );
    const testFiles = data.files.filter((file: FileData) =>
      file.Key.startsWith("test/")
    );

    // Group spck files by username
    const groupedSpckFiles = spckFiles.reduce(
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

    // Group test files by username
    const groupedTestFiles = testFiles.reduce(
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

    return {
      groupedSpckFiles,
      groupedTestFiles,
    };
  } catch (error) {
    console.error("Error listing files:", error);
    // return NextResponse.json(
    //   { error: "Failed to list files" },
    //   { status: 500 }
    // );
    throw new Error("Failed to list files");
  }
};

export const uploadFile = async (file: File, username: string, docType: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    formData.append("docType", docType);
    
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_APP_URL}/file/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
