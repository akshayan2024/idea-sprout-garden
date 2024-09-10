import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from '../components/AuthForm';
import ContentAspirationForm from '../components/ContentAspirationForm';
import ContentIdeaGenerator from '../components/ContentIdeaGenerator';
import TreemapVisualization from '../components/TreemapVisualization';
import ProfileSection from '../components/ProfileSection';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userDictionary, setUserDictionary] = useState(null);

  useEffect(() => {
    // Simulating a check for existing user session
    const checkUserSession = async () => {
      try {
        // Replace this with actual API call to check user session
        const response = await fetch('http://localhost:5000/check-session', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          setUserProfile(userData.profile);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    };

    checkUserSession();
  }, []);

  const handleLogin = async (userData) => {
    setIsLoggedIn(true);
    setUserProfile(userData.profile);
  };

  const handleContentAspirationSubmit = (data) => {
    setUserDictionary({
      ...data.meta_creator,
      ...data.meta_content
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-skyBlue to-brand-goldenYellow p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-brand-lightGray">Content Idea Sprout Garden</h1>
      {isLoggedIn && <ProfileSection userProfile={userProfile} />}
      <div className="max-w-3xl mx-auto">
        {!isLoggedIn ? (
          <AuthForm onLogin={handleLogin} />
        ) : (
          <Tabs defaultValue="aspiration" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-brand-lightGray">
              <TabsTrigger value="aspiration" className="data-[state=active]:bg-brand-skyBlue data-[state=active]:text-white">Content Aspiration</TabsTrigger>
              <TabsTrigger value="generator" className="data-[state=active]:bg-brand-skyBlue data-[state=active]:text-white">Idea Generator</TabsTrigger>
              <TabsTrigger value="visualization" className="data-[state=active]:bg-brand-skyBlue data-[state=active]:text-white">Visualization</TabsTrigger>
            </TabsList>
            <TabsContent value="aspiration">
              <Card className="bg-brand-lightGray border-brand-skyBlue">
                <ContentAspirationForm onSubmit={handleContentAspirationSubmit} />
              </Card>
            </TabsContent>
            <TabsContent value="generator">
              <Card className="bg-brand-lightGray border-brand-skyBlue">
                <ContentIdeaGenerator userDictionary={userDictionary} />
              </Card>
            </TabsContent>
            <TabsContent value="visualization">
              <Card className="bg-brand-lightGray border-brand-skyBlue">
                <TreemapVisualization data={userDictionary} />
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;