import React from 'react';
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';

const MyAreaChart = ({ data }: { data: any }) => {
  // Preprocess the data to include a 'color' property
  const processedData = data.map((entry: any) => ({
    ...entry,
    color: entry.value < 0 ? 'red' : 'blue',
  }));

  return (
    <AreaChart width={400} height={200} data={processedData}>
      {/* <CartesianGrid strokeDasharray='4 0' /> */}
      <XAxis dataKey='minute' hide={true} /> {/* Hide X axis labels */}
      <YAxis hide={true} /> {/* Hide Y axis labels */}
      <Tooltip />
      <Area
        type='monotone'
        dataKey='value'
        fill='currentColor' // Use the 'color' property for fill color
        fillOpacity={0.5} // Opacity of the fill color
        stroke='none' // Remove the stroke color (optional)
      />
    </AreaChart>
  );
};

function AttackMomentBasketball({ graphPoints }: { graphPoints: any }) {
  return <MyAreaChart data={graphPoints} />;
}

export default AttackMomentBasketball;
