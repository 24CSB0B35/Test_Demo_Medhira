import React from 'react';
import Navbar from '../components/common/Navbar';
import HistoryTable from '../components/dashboard/HistoryTable';
import { useAuth } from '../hooks/useAuth';

const HistoryPage = () => {
  const { user } = useAuth();

  return (
    <div className="history-page">
      <Navbar />
      <div className="page-container">
        <div className="history-header">
          <h1>Consultation History</h1>
          <p>View and manage your past patient consultations</p>
          {user && (
            <div className="user-info">
              <span>Logged in as: <strong>{user.username || user.email}</strong></span>
            </div>
          )}
        </div>
        <HistoryTable />
      </div>
    </div>
  );
};

export default HistoryPage;