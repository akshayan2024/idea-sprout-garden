import React from 'react';
import { Card } from "@/components/ui/card";
import { useContentStore } from '../store/contentStore';
import ContentIdeaGenerator from './ContentIdeaGenerator';

const Dashboard = () => {
  const { existingIdeas } = useContentStore();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-brand-medium border-brand-accent">
        <h2 className="text-2xl font-semibold mb-4 text-brand-accent">Your Existing Ideas</h2>
        <ul className="list-disc pl-5 space-y-2 text-foreground">
          {existingIdeas.map((idea, index) => (
            <li key={index}>{idea}</li>
          ))}
        </ul>
      </Card>
      <Card className="p-6 bg-brand-medium border-brand-accent">
        <h2 className="text-2xl font-semibold mb-4 text-brand-accent">Generate New Ideas</h2>
        <ContentIdeaGenerator />
      </Card>
    </div>
  );
};

export default Dashboard;