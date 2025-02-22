"use client";

import { useCallback, useEffect, useState } from "react";
import { CloudIcon } from "lucide-react";
import FileList, { FileData } from "./components/file-list";
import { ToasterProvider } from "./components/toaster-provider";
import UploadFile from "./components/UploadFile";

export default function Home() {
  const [groupedFiles, setGroupedFiles] = useState<{
    [username: string]: FileData[];
  }>();

  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch("/api/list");
      if (response.ok) {
        const data = await response.json();
        setGroupedFiles(data.groupedFiles);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [groupedFiles]);

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-200 p-4">
      <ToasterProvider />

      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center justify-center">
          <CloudIcon className="h-10 w-10 text-teal-600 mr-3" />
          <br className="sm:hidden" />
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            MindX SPCK Storage của thầy Vũ
          </h1>
        </header>

        <UploadFile />
        <FileList groupedFiles={groupedFiles} />
      </div>
    </main>
  );
}
