import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const ContentAspirationForm = ({ onSubmit, uploadedContent }) => {
  const [tone, setTone] = useState('');
  const [style, setStyle] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    if (uploadedContent) {
      setInterests(uploadedContent);
    }
  }, [uploadedContent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ tone, style, interests });
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
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Content Interests</label>
          <Textarea
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Describe your main content interests and topics"
            required
          />
        </div>
        <Button type="submit">Submit Aspirations</Button>
      </form>
    </Card>
  );
};

export default ContentAspirationForm;