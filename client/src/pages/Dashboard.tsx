import React from 'react';
import PortfolioSummary from './PortfolioSummary';
import PortfolioComposition from './PortfolioComposition';
import HistoricalValueChart from './HistoricalValueChart';

const Dashboard: React.FC = () => {
  return (
    <div className="p-5">
      <div className="p-7"></div>
        <PortfolioSummary />
      <div className='p-7'></div>
      <div className="flex flex-row gap-4">
        <PortfolioComposition />
        <HistoricalValueChart />
      </div>
    </div>
  );
};

export default Dashboard;