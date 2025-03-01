import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !username) return;

    let toastId: string | number | undefined;
    try {
      setIsUploading(true);
      toastId = toast.loading("Uploading file...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username);
      const response = await fetch(`http://localhost:3000/file/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      toast.success("File uploaded successfully!", { id: toastId });
      setFile(null);
      setUsername("");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload failed", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-gray-700 flex items-center">
          <Upload className="mr-2 h-5 w-5 text-teal-600" />
          Upload File
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <Input
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-gray-300"
          />
          <Input
            type="file"
            onChange={handleFileChange}
            className="border-gray-300"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || !username || isUploading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadFile;
