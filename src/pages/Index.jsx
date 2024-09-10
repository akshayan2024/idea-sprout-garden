import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ContentIdeaGenerator from '../components/ContentIdeaGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Content Idea Generator</h1>
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Brand Insights</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">Brand/Channel Name</label>
              <Input id="brandName" placeholder="Enter your brand or channel name" />
            </div>
            <div>
              <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">Niche/Industry</label>
              <Input id="niche" placeholder="e.g., Technology, Fashion, Fitness" />
            </div>
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <Input id="targetAudience" placeholder="Describe your target audience" />
            </div>
            <div>
              <label htmlFor="brandValues" className="block text-sm font-medium text-gray-700 mb-1">Brand Values</label>
              <Textarea id="brandValues" placeholder="What does your brand stand for?" />
            </div>
            <Button type="submit">Generate Ideas</Button>
          </form>
        </Card>
        <ContentIdeaGenerator />
      </div>
    </div>
  );
};

export default Index;