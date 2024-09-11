import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useContentStore } from '../store/contentStore';

const ContentIdeaGenerator = () => {
  const [trendingWord, setTrendingWord] = useState('');
  const { generateIdeas, generatedIdeas } = useContentStore();

  const handleGenerateIdeas = async () => {
    const data = {
      trendingWord: trendingWord,
    };
    await generateIdeas(data);
  };

  return (
    <Card className="p-6 bg-brand-medium text-foreground">
      <h2 className="text-2xl font-semibold mb-4 text-brand-accent">Generate Content Ideas</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="trendingWord" className="block text-sm font-medium text-foreground mb-1">Trending Word</label>
          <Input
            id="trendingWord"
            value={trendingWord}
            onChange={(e) => setTrendingWord(e.target.value)}
            placeholder="Enter a trending word or topic"
            className="bg-brand-light text-foreground"
          />
        </div>
        <Button onClick={handleGenerateIdeas} className="bg-brand-accent hover:bg-brand-accent/80 text-white">Generate Ideas</Button>
      </div>
      {generatedIdeas.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-brand-accent">Generated Ideas:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {generatedIdeas.map((idea, index) => (
              <li key={index} className="text-foreground">{idea}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default ContentIdeaGenerator;