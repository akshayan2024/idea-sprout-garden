import React from 'react';
import { Card } from "@/components/ui/card";
import { useContentStore } from '../store/contentStore';
import ContentIdeaGenerator from './ContentIdeaGenerator';

const Dashboard = () => {
  const { existingIdeas } = useContentStore();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-brand-lightGray border-brand-skyBlue">
        <h2 className="text-2xl font-semibold mb-4">Your Existing Ideas</h2>
        <ul className="list-disc pl-5 space-y-2">
          {existingIdeas.map((idea, index) => (
            <li key={index} className="text-gray-700">{idea}</li>
          ))}
        </ul>
      </Card>
      <Card className="p-6 bg-brand-lightGray border-brand-skyBlue">
        <h2 className="text-2xl font-semibold mb-4">Generate New Ideas</h2>
        <ContentIdeaGenerator />
      </Card>
    </div>
  );
};

export default Dashboard;