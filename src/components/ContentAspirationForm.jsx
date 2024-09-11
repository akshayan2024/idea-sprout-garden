import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContentStore } from '../store/contentStore';
import { toast } from 'sonner';
import FileUploader from './FileUploader';

const ContentAspirationForm = () => {
  const [creatorText, setCreatorText] = useState('');
  const [contentText, setContentText] = useState('');
  const { processContentAspiration, setHasUploadedFiles } = useContentStore();

  const handleCreatorFileUpload = (content) => {
    setCreatorText(content);
  };

  const handleContentFileUpload = (content) => {
    setContentText(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!creatorText || !contentText) {
      toast.error('Please upload both files before submitting.');
      return;
    }

    const data = {
      creator_text: creatorText,
      content_text: contentText,
    };

    try {
      await processContentAspiration(data);
      setHasUploadedFiles(true);
      toast.success('Content aspirations processed successfully!');
    } catch (error) {
      toast.error('Failed to process content aspirations. Please try again.');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Content Aspirations</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FileUploader onFileUpload={handleCreatorFileUpload} label="Upload file about yourself" />
        <FileUploader onFileUpload={handleContentFileUpload} label="Upload file about your content aspirations" />
        <Button type="submit">Submit Aspirations</Button>
      </form>
    </Card>
  );
};

export default ContentAspirationForm;