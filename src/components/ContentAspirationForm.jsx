import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useContentStore } from '../store/contentStore';
import { toast } from 'sonner';

const ContentAspirationForm = () => {
  const [tone, setTone] = useState('');
  const [style, setStyle] = useState('');
  const processContentAspiration = useContentStore((state) => state.processContentAspiration);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      user_id: 'user123', // Replace with actual user ID
      creator_text: `${tone} ${style}`,
      content_text: 'Sample content text', // Replace with actual content
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
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">Preferred Tone</label>
          <Input
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="e.g., Professional, Casual, Humorous"
            required
          />
        </div>
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">Content Style</label>
          <Input
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="e.g., Informative, Story-telling, Tutorial"
            required
          />
        </div>
        <Button type="submit">Submit Aspirations</Button>
      </form>
    </Card>
  );
};

export default ContentAspirationForm;