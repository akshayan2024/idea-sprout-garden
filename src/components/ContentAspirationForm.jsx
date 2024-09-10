import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const BACKEND_URL = 'http://localhost:5000'; // Update this if your backend is running on a different port

const ContentAspirationForm = ({ onSubmit, uploadedContent }) => {
  const [tone, setTone] = useState('');
  const [style, setStyle] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    if (uploadedContent) {
      setInterests(uploadedContent);
    }
  }, [uploadedContent]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      user_id: 'user123', // Replace with actual user ID
      creator_text: `${tone} ${style}`,
      content_text: interests,
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
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Content Interests</label>
          <Textarea
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Describe your main content interests and topics"
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