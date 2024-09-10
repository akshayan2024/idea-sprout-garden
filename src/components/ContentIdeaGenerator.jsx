import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const ContentIdeaGenerator = ({ userDictionary }) => {
  const [trendingWord, setTrendingWord] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState([]);

  const generateIdeas = () => {
    // In a real application, this would make an API call to your backend
    // which would then use GPT-4 to generate ideas based on the user's dictionary and trending word
    // For now, we'll simulate this process with some placeholder ideas
    const simulatedIdeas = [
      `How ${trendingWord} is Revolutionizing the Tech Industry`,
      `The Future of ${trendingWord}: A Sustainable Approach`,
      `10 Innovative Ways to Use ${trendingWord} in Your Daily Life`,
      `The Ethical Implications of ${trendingWord} in Modern Society`,
      `${trendingWord}: A Comprehensive Guide for Beginners`
    ];
    setGeneratedIdeas(simulatedIdeas);
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
        <Button onClick={generateIdeas}>Generate Ideas</Button>
      </div>
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