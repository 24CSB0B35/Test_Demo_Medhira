import React from 'react';
import { ExternalLink, Calendar, User, Trash2, Eye, UserCheck } from 'lucide-react';
import { useConsultations } from '../../hooks/useConsultations';
import { useAuth } from '../../hooks/useAuth';

const HistoryTable = () => {
  const { consultations, deleteConsultation } = useConsultations();
  const { user } = useAuth();

  const handleDelete = (id, patientName) => {
    if (window.confirm(`Are you sure you want to delete the consultation for ${patientName}?`)) {
      deleteConsultation(id);
    }
  };

  const handleViewDetails = (consultation) => {
    alert(`Patient: ${consultation.patientName}\nDiagnosis: ${consultation.diagnosis}\nDate: ${consultation.date}\nSaved by: ${user?.email}`);
  };

  // Fix: Use user?.id instead of user?.uid for JWT authentication
  const userConsultations = consultations.filter(consultation => 
    consultation.userId === user?.id || 
    consultation.userId === user?._id || 
    !consultation.userId // Include legacy consultations without userId
  );

  if (userConsultations.length === 0) {
    return (
      <div className="history-table">
        <div className="history-header">
          <h2>Consultation History</h2>
          <p>
            <UserCheck size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Viewing history for: <strong>{user?.username || user?.email}</strong>
          </p>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No consultations yet</h3>
          <p>Record and save your first consultation to see it here.</p>
          <p>Start by clicking "Record Consultation" in the sidebar.</p>
          <div className="user-info">
            <p><strong>Account:</strong> {user?.username || user?.email}</p>
            <p><strong>Data Storage:</strong> This browser</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-table">
      <div className="history-header">
        <h2>Consultation History</h2>
        <p>
          <UserCheck size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Viewing history for: <strong>{user?.username || user?.email}</strong> 
          ({userConsultations.length} consultation{userConsultations.length !== 1 ? 's' : ''})
        </p>
      </div>

      <div className="table-container">
        <table className="consultation-table">
          <thead>
            <tr>
              <th>
                <Calendar size={16} />
                Date
              </th>
              <th>
                <User size={16} />
                Patient Name
              </th>
              <th>Diagnosis</th>
              <th>Status</th>
              <th>Drive Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userConsultations.map((consultation) => (
              <tr key={consultation.id}>
                <td>
                  <div className="date-cell">
                    <span className="date">
                      {consultation.createdAt ? 
                        new Date(consultation.createdAt).toLocaleDateString() : 
                        consultation.date
                      }
                    </span>
                    <span className="time">
                      {consultation.createdAt ? 
                        new Date(consultation.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : 
                        'Unknown'
                      }
                    </span>
                  </div>
                </td>
                <td className="patient-name">
                  {consultation.patientName}
                </td>
                <td className="diagnosis">
                  {consultation.diagnosis}
                </td>
                <td>
                  <span className={`status-badge ${consultation.status || 'completed'}`}>
                    {consultation.status || 'Completed'}
                  </span>
                </td>
                <td>
                  {consultation.driveLink ? (
                    <a 
                      href={consultation.driveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="drive-link"
                      title="Open in Google Drive"
                    >
                      <ExternalLink size={16} />
                      View PDF
                    </a>
                  ) : (
                    <span className="no-link">Not saved to Drive</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleViewDetails(consultation)}
                      className="action-button view-button"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(consultation.id, consultation.patientName)}
                      className="action-button delete-button"
                      title="Delete Consultation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <span className="stat-number">{userConsultations.length}</span>
          <span className="stat-label">Your Consultations</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {userConsultations.filter(c => c.driveLink).length}
          </span>
          <span className="stat-label">Saved to Drive</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {new Set(userConsultations.map(c => c.patientName)).size}
          </span>
          <span className="stat-label">Unique Patients</span>
        </div>
      </div>

      <div className="user-notice">
        <p>
          💡 <strong>Note:</strong> Your consultation history is stored in this browser. 
          If you switch browsers or clear data, you'll need to export your summaries.
        </p>
      </div>
    </div>
  );
};

export default HistoryTable;