import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Calendar, Download } from "lucide-react";
import { useState } from "react";

export type FileData = {
  pathname: string;
  size: number;
  lastUpdate: string;
  downloadUrl: string;
  username: string;
};

interface FileListProps {
  groupedFiles: {
    groupedSpckFiles: Record<string, FileData[]>;
    groupedTestFiles: Record<string, FileData[]>;
  };
  fileType: "spck" | "test";
}

export default function FileList({ groupedFiles, fileType }: FileListProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = async (file: FileData) => {
    try {
      // Extract filename from pathname
      const fileName = file.pathname.split("/").pop() || "Unknown";
      setIsDownloading(file.pathname);

      const response = await fetch(
        `${process.env.VITE_SERVER_APP_URL}/file/download`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: `${file.username}/${fileName}`, // Combine username and filename
            docType: fileType === "spck" ? "spck" : "test",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      setIsDownloading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Helper function to render files for each username
  const renderUserFiles = (username: string, files: FileData[]) => {
    return (
      <div key={username} className="mb-6">
        <div className="flex items-center mb-4">
          <Folder className="h-5 w-5 mr-2 text-yellow-400" />
          <h2 className="text-black text-lg font-semibold">
            {username}'s Folder
          </h2>
        </div>
        <ul className="space-y-2 pl-6">
          {files.map((file) => {
            // Extract filename from pathname
            const filename = file.pathname.split("/").pop() || "Unknown";

            return (
              <li
                key={file.pathname}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-green-100 p-3 rounded-lg shadow hover:bg-green-200 transition-colors"
              >
                <div className="flex flex-col mb-2 sm:mb-0 flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="font-medium text-black truncate max-w-[200px] sm:max-w-[300px]">
                      {filename}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-black mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(file.lastUpdate).toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => handleDownload(file)}
                    disabled={isDownloading === file.pathname}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading === file.pathname
                      ? "Downloading..."
                      : "Download"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Get the appropriate files based on fileType
  const filesToRender =
    fileType === "spck"
      ? groupedFiles.groupedSpckFiles
      : groupedFiles.groupedTestFiles;

  return (
    <Card className="bg-white backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-black">
          {fileType === "spck" ? "SPCK Files" : "Test Files"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(filesToRender).map(([username, files]) =>
          renderUserFiles(username, files)
        )}
      </CardContent>
    </Card>
  );
}
