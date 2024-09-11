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
  const { uploadContentAspiration, processContentAspiration } = useContentStore();
  const { userProfile } = useAuthStore();
  const [isUploaded, setIsUploaded] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

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
      await uploadContentAspiration(data);
      setIsUploaded(true);
      toast.success('Content aspirations uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload content aspirations. Please try again.');
    }
  };

  const handleProcess = async () => {
    try {
      await processContentAspiration(userProfile.id);
      setIsProcessed(true);
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
        <div className="flex space-x-4">
          <Button type="submit" className="bg-brand-accent hover:bg-brand-accent/80 text-white">Submit Aspirations</Button>
          {isUploaded && !isProcessed && (
            <Button onClick={handleProcess} className="bg-brand-accent hover:bg-brand-accent/80 text-white">Process Aspirations</Button>
          )}
        </div>
      </form>
      {isProcessed && (
        <p className="mt-4 text-green-500">Your content aspirations have been processed successfully!</p>
      )}
    </Card>
  );
};

export default ContentAspirationForm;