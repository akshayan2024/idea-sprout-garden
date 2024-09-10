import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useMutation } from '@tanstack/react-query';

const ContentIdeaGenerator = ({ userDictionary }) => {
  const [trendingWord, setTrendingWord] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState([]);

  const generateIdeasMutation = useMutation({
    mutationFn: (data) => 
      fetch('http://localhost:5000/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),
  });

  const generateIdeas = () => {
    const data = {
      user_id: 'user123', // Replace with actual user ID
      trendingWord: trendingWord,
    };
    generateIdeasMutation.mutate(data, {
      onSuccess: (data) => {
        setGeneratedIdeas(data.ideas);
      },
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Generate Content Ideas</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="trendingWord" className="block text-sm font-medium text-gray-700 mb-1">Trending Word</label>
          <Input
            id="trendingWord"
            value={trendingWord}
            onChange={(e) => setTrendingWord(e.target.value)}
            placeholder="Enter a trending word or topic"
          />
        </div>
        <Button onClick={generateIdeas} disabled={generateIdeasMutation.isPending}>
          {generateIdeasMutation.isPending ? 'Generating...' : 'Generate Ideas'}
        </Button>
      </div>
      {generateIdeasMutation.isError && (
        <p className="text-red-500 mt-2">Error: {generateIdeasMutation.error.message}</p>
      )}
      {generatedIdeas.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Generated Ideas:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {generatedIdeas.map((idea, index) => (
              <li key={index} className="text-gray-700">{idea}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default ContentIdeaGenerator;