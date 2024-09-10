import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from '../components/AuthForm';
import ProfileForm from '../components/ProfileForm';
import ContentAspirationForm from '../components/ContentAspirationForm';
import ContentIdeaGenerator from '../components/ContentIdeaGenerator';
import TreemapVisualization from '../components/TreemapVisualization';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [userDictionary, setUserDictionary] = useState(null);

  const handleLogin = () => {
    // Implement actual login logic here
    setIsLoggedIn(true);
  };

  const handleProfileCreation = () => {
    // Implement actual profile creation logic here
    setHasProfile(true);
  };

  const handleContentAspirationSubmit = (aspirations) => {
    // Here you would typically send the aspirations to your backend
    // and receive the processed dictionary. For now, we'll simulate this:
    const simulatedDictionary = {
      technology: 10,
      innovation: 8,
      AI: 7,
      sustainability: 6,
      future: 5
    };
    setUserDictionary(simulatedDictionary);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Content Idea Generator</h1>
      <div className="max-w-3xl mx-auto">
        {!isLoggedIn ? (
          <AuthForm onLogin={handleLogin} />
        ) : !hasProfile ? (
          <ProfileForm onProfileCreation={handleProfileCreation} />
        ) : (
          <Tabs defaultValue="aspiration">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aspiration">Content Aspiration</TabsTrigger>
              <TabsTrigger value="generator">Idea Generator</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
            </TabsList>
            <TabsContent value="aspiration">
              <ContentAspirationForm onSubmit={handleContentAspirationSubmit} />
            </TabsContent>
            <TabsContent value="generator">
              <ContentIdeaGenerator userDictionary={userDictionary} />
            </TabsContent>
            <TabsContent value="visualization">
              <TreemapVisualization data={userDictionary} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;