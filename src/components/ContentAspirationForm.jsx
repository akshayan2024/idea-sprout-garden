import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContentStore } from '../store/contentStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';
import FileUploader from './FileUploader';

const ContentAspirationForm = () => {
  const [creatorText, setCreatorText] = useState('');
  const [contentText, setContentText] = useState('');
  const [creatorFileName, setCreatorFileName] = useState('');
  const [contentFileName, setContentFileName] = useState('');
  const { processContentAspiration, setHasUploadedFiles } = useContentStore();
  const { userProfile } = useAuthStore();

  const handleCreatorFileUpload = (content, fileName) => {
    setCreatorText(content);
    setCreatorFileName(fileName);
  };

  const handleContentFileUpload = (content, fileName) => {
    setContentText(content);
    setContentFileName(fileName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!creatorText || !contentText) {
      toast.error('Please upload both files before submitting.');
      return;
    }

    const data = {
      user_id: userProfile.id,
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
    <Card className="p-6 bg-brand-medium text-foreground">
      <h2 className="text-2xl font-semibold mb-4 text-brand-accent">Content Aspirations</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FileUploader onFileUpload={handleCreatorFileUpload} label="Upload file about yourself" />
        <FileUploader onFileUpload={handleContentFileUpload} label="Upload file about your content aspirations" />
        <Button type="submit" className="bg-brand-accent hover:bg-brand-accent/80 text-white">Submit Aspirations</Button>
      </form>
    </Card>
  );
};

export default ContentAspirationForm;