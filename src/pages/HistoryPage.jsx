import React from 'react';
import Navbar from '../components/common/Navbar';
import HistoryTable from '../components/dashboard/HistoryTable';

const HistoryPage = () => {
  return (
    <div className="history-page">
      <Navbar />
      <div className="page-container">
        <HistoryTable />
      </div>
    </div>
  );
};

export default HistoryPage;