import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const BACKEND_URL = 'http://localhost:5000';

const ContentAspirationForm = ({ onSubmit }) => {
  const [tone, setTone] = useState('');
  const [style, setStyle] = useState('');
  const [creatorFile, setCreatorFile] = useState(null);
  const [channelFile, setChannelFile] = useState(null);

  const processInputMutation = useMutation({
    mutationFn: (data) => 
      fetch(`${BACKEND_URL}/process-input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      }),
    onError: (error) => {
      console.error('Error processing input:', error);
      toast.error('Failed to process input. Please try again.');
    },
  });

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!creatorFile || !channelFile) {
      toast.error('Please upload both creator and channel files.');
      return;
    }

    const creatorContent = await creatorFile.text();
    const channelContent = await channelFile.text();

    const data = {
      user_id: 'user123', // Replace with actual user ID
      creator_text: `${tone} ${style}\n${creatorContent}`,
      content_text: channelContent,
    };

    processInputMutation.mutate(data, {
      onSuccess: (data) => {
        onSubmit(data);
        toast.success('Content aspirations processed successfully!');
      },
    });
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
          <label htmlFor="creatorFile" className="block text-sm font-medium text-gray-700 mb-1">Upload Creator File</label>
          <Input
            id="creatorFile"
            type="file"
            accept=".txt"
            onChange={(e) => handleFileChange(e, setCreatorFile)}
            required
          />
        </div>
        <div>
          <label htmlFor="channelFile" className="block text-sm font-medium text-gray-700 mb-1">Upload Channel File</label>
          <Input
            id="channelFile"
            type="file"
            accept=".txt"
            onChange={(e) => handleFileChange(e, setChannelFile)}
            required
          />
        </div>
        <Button type="submit" disabled={processInputMutation.isPending}>
          {processInputMutation.isPending ? 'Submitting...' : 'Submit Aspirations'}
        </Button>
      </form>
      {processInputMutation.isError && (
        <p className="text-red-500 mt-2">Error: {processInputMutation.error.message}</p>
      )}
    </Card>
  );
};

export default ContentAspirationForm;