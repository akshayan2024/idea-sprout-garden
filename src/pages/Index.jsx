import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from '../components/AuthForm';
import ContentAspirationForm from '../components/ContentAspirationForm';
import ContentIdeaGenerator from '../components/ContentIdeaGenerator';
import TreemapVisualization from '../components/TreemapVisualization';
import ProfileSection from '../components/ProfileSection';
import Dashboard from '../components/Dashboard';
import { useAuthStore } from '../store/authStore';
import { useContentStore } from '../store/contentStore';

const Index = () => {
  const { isLoggedIn, checkSession, userProfile } = useAuthStore();
  const { userDictionary, fetchExistingIdeas, hasUploadedFiles, processedKeywords } = useContentStore();
  const [activeTab, setActiveTab] = useState('aspiration');

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isLoggedIn && userProfile) {
      fetchExistingIdeas(userProfile.id);
    }
  }, [isLoggedIn, userProfile, fetchExistingIdeas]);

  useEffect(() => {
    if (hasUploadedFiles && processedKeywords) {
      setActiveTab('visualization');
    }
  }, [hasUploadedFiles, processedKeywords]);

  useEffect(() => {
    if (processedKeywords && activeTab === 'visualization') {
      const timer = setTimeout(() => setActiveTab('generator'), 5000); // Auto-switch to generator after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [processedKeywords, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-skyBlue to-brand-goldenYellow p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-brand-lightGray">Content Idea Sprout Garden</h1>
      {isLoggedIn && <ProfileSection />}
      <div className="max-w-3xl mx-auto">
        {!isLoggedIn ? (
          <AuthForm />
        ) : userProfile?.hasExistingIdeas ? (
          <Dashboard />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-brand-lightGray">
              <TabsTrigger value="aspiration" className="data-[state=active]:bg-brand-skyBlue data-[state=active]:text-white">Content Aspiration</TabsTrigger>
              <TabsTrigger value="visualization" className="data-[state=active]:bg-brand-skyBlue data-[state=active]:text-white">Visualization</TabsTrigger>
              <TabsTrigger value="generator" className="data-[state=active]:bg-brand-skyBlue data-[state=active]:text-white">Idea Generator</TabsTrigger>
            </TabsList>
            <TabsContent value="aspiration">
              <Card className="bg-brand-lightGray border-brand-skyBlue">
                <ContentAspirationForm />
              </Card>
            </TabsContent>
            <TabsContent value="visualization">
              <Card className="bg-brand-lightGray border-brand-skyBlue">
                <TreemapVisualization data={processedKeywords} />
              </Card>
            </TabsContent>
            <TabsContent value="generator">
              <Card className="bg-brand-lightGray border-brand-skyBlue">
                <ContentIdeaGenerator />
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;