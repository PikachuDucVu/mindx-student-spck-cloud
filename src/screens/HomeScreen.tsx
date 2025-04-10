import FileList, { FileData } from "@/components/file-list";
import UploadFile from "@/components/UploadFile";
import { ToasterProvider } from "@/provider/toaster-provider";
import { FetchFilesList } from "@/utils/api";
import { CloudIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HomeScreen = () => {
  const [fileType, setFileType] = useState<"spck" | "test">("spck");
  const [groupedFiles, setGroupedFiles] = useState<{
    groupedSpckFiles: Record<string, FileData[]>;
    groupedTestFiles: Record<string, FileData[]>;
  } | null>(null);

  const fetchFiles = useCallback(async () => {
    const files = await FetchFilesList();
    setGroupedFiles(files);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-200 p-4 h-full w-full overflow-y-auto">
      <ToasterProvider />

      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center justify-center">
          <CloudIcon className="h-10 w-10 text-teal-600 mr-3" />
          <br className="sm:hidden" />
          {/* <h1 className="text-4xl font-bold text-gray-800 text-center">
            MindX SPCK Storage của thầy Vũ
          </h1> */}
        </header>

        <UploadFile />
        <div className="flex gap-4">
          <Select
            value={fileType}
            onValueChange={(value: "spck" | "test") => setFileType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spck" className="hover:bg-gray-300">
                Sản phẩm cuối khóa
              </SelectItem>
              <SelectItem value="test" className="hover:bg-gray-300">
                Bài kiểm tra
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!!groupedFiles && (
          <FileList groupedFiles={groupedFiles} fileType={fileType} />
        )}
      </div>
    </main>
  );
};

export default HomeScreen;
