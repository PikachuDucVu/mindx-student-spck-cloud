import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Calendar, Download } from "lucide-react";

export type FileData = {
  pathname: string;
  size: number;
  lastUpdate: string;
  downloadUrl: string;
  username: string;
};

interface FileListProps {
  groupedFiles?: {
    [username: string]: FileData[];
  };
}

export default function FileList({ groupedFiles }: FileListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <Card className="bg-white  backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-black">SPCK Files</CardTitle>
      </CardHeader>
      <CardContent>
        {groupedFiles &&
          Object.entries(groupedFiles).map(([username, files]) => (
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
                  const filename =
                    file.pathname
                      .split("/")
                      .pop()
                      ?.split("_")
                      .slice(0, -1)
                      .join("_") ||
                    file.pathname.split("/")[2] ||
                    "Unknown";
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
                          <span>
                            {new Date(file.lastUpdate).toLocaleString()}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          // onClick={() => handleDownload(file.pathname)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
