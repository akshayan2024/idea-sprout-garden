import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FileUploader = ({ onFileUpload, label }) => {
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
    <Card className="p-4 bg-brand-light border-brand-accent mb-4">
      <h3 className="text-lg font-semibold mb-2 text-brand-accent">{label}</h3>
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
    </Card>
  );
};

export default FileUploader;