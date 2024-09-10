import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";

const CustomizedContent = (props) => {
  const { root, depth, x, y, width, height, index, name, value } = props;

  const leafPath = "M0,0 C0,0 50,100 0,200 C0,200 50,100 100,200 C100,200 50,100 100,0 C100,0 50,100 0,0";

  const gradientId = `gradient-${index}`;
  const lightGreen = `hsl(120, 70%, ${80 - depth * 20}%)`;
  const darkGreen = `hsl(120, 70%, ${60 - depth * 20}%)`;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lightGreen} />
          <stop offset="100%" stopColor={darkGreen} />
        </linearGradient>
      </defs>
      <path
        d={leafPath}
        transform={`translate(${x},${y}) scale(${width / 100}, ${height / 200})`}
        fill={`url(#${gradientId})`}
        stroke="#fff"
        strokeWidth={2 / (depth + 1e-10)}
        strokeOpacity={1 / (depth + 1e-10)}
        className="cursor-pointer transition-all hover:brightness-110"
      />
      {depth === 1 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          className="pointer-events-none"
        >
          {name}
        </text>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-leaf-light p-2 border border-leaf rounded shadow">
        <p className="text-leaf-dark">{`${data.name}: ${data.size}`}</p>
      </div>
    );
  }
  return null;
};

const TreemapVisualization = ({ data }) => {
  const transformedData = {
    name: 'Content Aspirations',
    children: Object.entries(data || {}).map(([name, size]) => ({ name, size })),
  };

  const handleClick = (data) => {
    console.log('Clicked leaf:', data);
    // Add your interaction logic here
  };

  return (
    <Card className="p-6 bg-leaf-light border-leaf">
      <h2 className="text-2xl font-semibold mb-4 text-leaf-dark">Content Aspiration Visualization</h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer>
          <Treemap
            data={[transformedData]}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
            onClick={handleClick}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TreemapVisualization;