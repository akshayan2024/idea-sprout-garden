import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentAspirationForm from '../components/ContentAspirationForm';
import ContentIdeaGenerator from '../components/ContentIdeaGenerator';
import TreemapVisualization from '../components/TreemapVisualization';
import ProfileSection from '../components/ProfileSection';
import Dashboard from '../components/Dashboard';
import { useAuthStore } from '../store/authStore';
import { useContentStore } from '../store/contentStore';

const Index = () => {
  const { userProfile } = useAuthStore();
  const { userDictionary, fetchExistingIdeas, hasUploadedFiles, processedKeywords } = useContentStore();
  const [activeTab, setActiveTab] = React.useState('aspiration');

  useEffect(() => {
    if (userProfile) {
      fetchExistingIdeas(userProfile.id);
    }
  }, [userProfile, fetchExistingIdeas]);

  useEffect(() => {
    if (hasUploadedFiles && processedKeywords) {
      setActiveTab('visualization');
    }
  }, [hasUploadedFiles, processedKeywords]);

  useEffect(() => {
    if (processedKeywords && activeTab === 'visualization') {
      const timer = setTimeout(() => setActiveTab('generator'), 5000);
      return () => clearTimeout(timer);
    }
  }, [processedKeywords, activeTab]);

  return (
    <div className="min-h-screen bg-brand-dark p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-brand-accent">Content Idea Sprout Garden</h1>
      <ProfileSection />
      <div className="max-w-3xl mx-auto">
        {userProfile?.hasExistingIdeas ? (
          <Dashboard />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-brand-medium">
              <TabsTrigger value="aspiration" className="data-[state=active]:bg-brand-accent data-[state=active]:text-white">Content Aspiration</TabsTrigger>
              <TabsTrigger value="visualization" className="data-[state=active]:bg-brand-accent data-[state=active]:text-white">Visualization</TabsTrigger>
              <TabsTrigger value="generator" className="data-[state=active]:bg-brand-accent data-[state=active]:text-white">Idea Generator</TabsTrigger>
            </TabsList>
            <TabsContent value="aspiration">
              <Card className="bg-brand-medium border-brand-accent">
                <ContentAspirationForm />
              </Card>
            </TabsContent>
            <TabsContent value="visualization">
              <Card className="bg-brand-medium border-brand-accent">
                <TreemapVisualization data={processedKeywords} />
              </Card>
            </TabsContent>
            <TabsContent value="generator">
              <Card className="bg-brand-medium border-brand-accent">
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