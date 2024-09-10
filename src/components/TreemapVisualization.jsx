import React from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";

const TreemapVisualization = ({ data }) => {
  const transformedData = Object.entries(data || {}).map(([name, size]) => ({ name, size }));

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Content Aspiration Visualization</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <Treemap
            data={transformedData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
          </Treemap>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TreemapVisualization;