import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useContentStore } from '../store/contentStore';
import { toast } from 'sonner';

const ContentAspirationForm = () => {
  const [creatorText, setCreatorText] = useState('');
  const [contentText, setContentText] = useState('');
  const processContentAspiration = useContentStore((state) => state.processContentAspiration);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      creator_text: creatorText,
      content_text: contentText,
    };

    try {
      await processContentAspiration(data);
      toast.success('Content aspirations processed successfully!');
    } catch (error) {
      toast.error('Failed to process content aspirations. Please try again.');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Content Aspirations</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="creatorText" className="block text-sm font-medium text-gray-700 mb-1">Creator Text</label>
          <Input
            id="creatorText"
            value={creatorText}
            onChange={(e) => setCreatorText(e.target.value)}
            placeholder="Describe your content creation style and goals"
            required
          />
        </div>
        <div>
          <label htmlFor="contentText" className="block text-sm font-medium text-gray-700 mb-1">Content Text</label>
          <Input
            id="contentText"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Describe your desired content output"
            required
          />
        </div>
        <Button type="submit">Submit Aspirations</Button>
      </form>
    </Card>
  );
};

export default ContentAspirationForm;