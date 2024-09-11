import React from 'react';
import { Card } from "@/components/ui/card";
import { useContentStore } from '../store/contentStore';

const MindMapNode = ({ name, children }) => (
  <div className="ml-4 mt-2">
    <div className="font-semibold">{name}</div>
    {children && (
      <div className="ml-4">
        {Object.entries(children).map(([key, value]) => (
          <div key={key} className="mt-1">
            {key}: {value}
          </div>
        ))}
      </div>
    )}
  </div>
);

const TreemapVisualization = () => {
  const { metaCreator, metaContent } = useContentStore();

  return (
    <Card className="p-6 bg-leaf-light border-leaf">
      <h2 className="text-2xl font-semibold mb-4 text-leaf-dark">Content Aspiration Mind Map</h2>
      <div className="text-leaf-dark">
        <MindMapNode name="Content Aspirations">
          <MindMapNode name="Creator" children={metaCreator} />
          <MindMapNode name="Content" children={metaContent} />
        </MindMapNode>
      </div>
    </Card>
  );
};

export default TreemapVisualization;