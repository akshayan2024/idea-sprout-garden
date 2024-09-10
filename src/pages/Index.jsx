import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from '../components/AuthForm';
import ProfileForm from '../components/ProfileForm';
import ContentAspirationForm from '../components/ContentAspirationForm';
import ContentIdeaGenerator from '../components/ContentIdeaGenerator';
import TreemapVisualization from '../components/TreemapVisualization';
import FileUploader from '../components/FileUploader';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [userDictionary, setUserDictionary] = useState(null);
  const [uploadedContent, setUploadedContent] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleProfileCreation = () => {
    setHasProfile(true);
  };

  const handleContentAspirationSubmit = (data) => {
    setUserDictionary({
      ...data.meta_creator,
      ...data.meta_content
    });
  };

  const handleFileUpload = (content) => {
    setUploadedContent(content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-light to-leaf p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-leaf-dark">Content Idea Sprout Garden</h1>
      <div className="max-w-3xl mx-auto">
        {!isLoggedIn ? (
          <AuthForm onLogin={handleLogin} />
        ) : !hasProfile ? (
          <ProfileForm onProfileCreation={handleProfileCreation} />
        ) : (
          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-leaf-light">
              <TabsTrigger value="upload" className="data-[state=active]:bg-leaf data-[state=active]:text-white">Upload File</TabsTrigger>
              <TabsTrigger value="aspiration" className="data-[state=active]:bg-leaf data-[state=active]:text-white">Content Aspiration</TabsTrigger>
              <TabsTrigger value="generator" className="data-[state=active]:bg-leaf data-[state=active]:text-white">Idea Generator</TabsTrigger>
              <TabsTrigger value="visualization" className="data-[state=active]:bg-leaf data-[state=active]:text-white">Visualization</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <FileUploader onFileUpload={handleFileUpload} />
            </TabsContent>
            <TabsContent value="aspiration">
              <Card className="bg-leaf-light border-leaf">
                <ContentAspirationForm onSubmit={handleContentAspirationSubmit} uploadedContent={uploadedContent} />
              </Card>
            </TabsContent>
            <TabsContent value="generator">
              <Card className="bg-leaf-light border-leaf">
                <ContentIdeaGenerator userDictionary={userDictionary} />
              </Card>
            </TabsContent>
            <TabsContent value="visualization">
              <Card className="bg-leaf-light border-leaf">
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