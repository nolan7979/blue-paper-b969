import React from 'react';

interface MatchInfoProps {
  surface: string;
  sets: number;
  hostCity: string;
  // hostCountry: string;
}

const LeagusInfo: React.FC<MatchInfoProps> = ({ surface, sets, hostCity }) => {
  return (
    <div className="relative bg-white p-4 lg:rounded-md dark:bg-primary-gradient dark:border-linear-box">
      <div className="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-700 py-2">
        <span className="text-gray-600 dark:text-gray-400">Surface</span>
        <span className="text-right text-gray-900 dark:text-white font-semibold">{surface}</span>
      </div>
      <div className="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-gray-700 py-2">
        <span className="text-gray-600 dark:text-gray-400">Sets</span>
        <span className="text-right text-gray-900 dark:text-white font-semibold">{sets}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600 dark:text-gray-400">Host city</span>
        <span className="text-right text-gray-900 dark:text-white font-semibold">{hostCity}</span>
      </div>
      {/* <div className="flex justify-between items-center py-2">
        <span className="text-gray-600 dark:text-gray-400">Host country</span>
        <span className="text-right text-gray-900 dark:text-white font-semibold">{hostCountry}</span>
      </div> */}
    </div>
  );
};

export default LeagusInfo;
