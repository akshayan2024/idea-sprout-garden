import React from 'react';
import { Card } from "@/components/ui/card";

const MindMapNode = ({ name, children }) => (
  <div className="ml-4 mt-2">
    <div className="font-semibold">{name}</div>
    {children && (
      <div className="ml-4">
        {Object.entries(children).map(([key, value]) => (
          <div key={key} className="mt-1">
            <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : value}
          </div>
        ))}
      </div>
    )}
  </div>
);

const TreemapVisualization = ({ data }) => {
  if (!data || !data.creator || !data.content) {
    return (
      <Card className="p-6 bg-leaf-light border-leaf">
        <h2 className="text-2xl font-semibold mb-4 text-leaf-dark">Content Aspiration Mind Map</h2>
        <p>No data available for visualization.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-leaf-light border-leaf">
      <h2 className="text-2xl font-semibold mb-4 text-leaf-dark">Content Aspiration Mind Map</h2>
      <div className="text-leaf-dark">
        <MindMapNode name="Content Aspirations">
          <MindMapNode name="Creator" children={data.creator} />
          <MindMapNode name="Content" children={data.content} />
        </MindMapNode>
      </div>
    </Card>
  );
};

export default TreemapVisualization;