import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FileUploader = ({ onFileUpload, label }) => {
  const fileInputRef = useRef(null);
  const [filePath, setFilePath] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        onFileUpload(content, file.name);
      };
      reader.readAsText(file);
      setFilePath(file.name); // Set the file name as the path
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Card className="p-4 bg-brand-light border-brand-accent mb-4">
      <h3 className="text-lg font-semibold mb-2 text-brand-accent">{label}</h3>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <Button onClick={handleButtonClick} className="bg-brand-accent hover:bg-brand-accent/80 text-white">
          Choose File
        </Button>
        {filePath && (
          <span className="text-sm text-brand-accent">{filePath}</span>
        )}
      </div>
    </Card>
  );
};

export default FileUploader;