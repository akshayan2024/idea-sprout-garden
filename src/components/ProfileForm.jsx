import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const ProfileForm = ({ onProfileCreation }) => {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [goals, setGoals] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the profile creation process
    // For now, we'll just call the onProfileCreation function
    onProfileCreation();
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">Content Niche</label>
          <Input
            id="niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">Content Goals</label>
          <Textarea
            id="goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Create Profile</Button>
      </form>
    </Card>
  );
};

export default ProfileForm;