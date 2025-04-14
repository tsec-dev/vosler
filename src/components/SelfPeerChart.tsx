import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  LabelList
} from 'recharts';

interface AverageData {
  category: string;
  selfavg: number;
  peeravg: number;
  gap: number;
}

interface SelfPeerChartProps {
  data: AverageData[];
}

const SelfPeerChart: React.FC<SelfPeerChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" tick={{ fontSize: 12 }}>
          <Label value="Category" offset={-10} position="insideBottom" style={{ fill: '#666' }} />
        </XAxis>
        <YAxis tick={{ fontSize: 12 }}>
          <Label
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: 'middle', fill: '#666' }}
            value="Rating"
          />
        </YAxis>
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        {/* Self Average bar in blue */}
        <Bar
          dataKey="selfavg"
          fill="#007bff"
          name="Self Average"
          barSize={30}
          animationDuration={800}
        >
          <LabelList dataKey="selfavg" position="top" formatter={(value: number) => value.toFixed(1)} />
        </Bar>
        {/* Peer Average bar in green */}
        <Bar
          dataKey="peeravg"
          fill="#28a745"
          name="Peer Average"
          barSize={30}
          animationDuration={800}
        >
          <LabelList dataKey="peeravg" position="top" formatter={(value: number) => value.toFixed(1)} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SelfPeerChart;
