import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FileUploader = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        onFileUpload(content);
      };
      reader.readAsText(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Card className="p-6 bg-leaf-light border-leaf">
      <h2 className="text-2xl font-semibold mb-4 text-leaf-dark">Upload Text File</h2>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <Button onClick={handleButtonClick} className="bg-leaf hover:bg-leaf-dark text-white">
        Choose File
      </Button>
    </Card>
  );
};

export default FileUploader;