import React from 'react';

const PortfolioSummary: React.FC = () => {
  // Placeholder for actual data
  const totalPortfolioValue = '$352,028.62';
  const cashBalance = '$79,502.34';
  const interestReceived = '$17,418.12';

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">Cash Balance</p>
          <p className="text-xl">{cashBalance}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Portfolio Value</p>
          <p className="text-xl">{totalPortfolioValue}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Interest Received</p>
          <p className="text-xl">{interestReceived}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;