import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";

const CustomizedContent = (props) => {
  const { root, depth, x, y, width, height, index, name, value } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? '#8884d8' : '#84a9d8',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {name}
        </text>
      )}
    </g>
  );
};

const TreemapVisualization = ({ data }) => {
  const transformedData = {
    name: 'Content Aspirations',
    children: Object.entries(data || {}).map(([name, size]) => ({ name, size })),
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Content Aspiration Visualization</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <Treemap
            data={[transformedData]}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p>{`${data.name}: ${data.size}`}</p>
      </div>
    );
  }
  return null;
};

export default TreemapVisualization;