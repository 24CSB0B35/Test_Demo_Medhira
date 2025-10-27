import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';

const HistoryTable = () => {
  // Mock data - replace with actual API call
  const consultations = [
    {
      id: '1',
      date: '2024-01-15',
      patientName: 'John Smith',
      diagnosis: 'Hypertension',
      driveLink: 'https://drive.google.com/file/1'
    },
    {
      id: '2',
      date: '2024-01-10',
      patientName: 'Sarah Johnson',
      diagnosis: 'Type 2 Diabetes',
      driveLink: 'https://drive.google.com/file/2'
    },
    {
      id: '3', 
      date: '2024-01-05',
      patientName: 'Michael Brown',
      diagnosis: 'Upper Respiratory Infection',
      driveLink: 'https://drive.google.com/file/3'
    }
  ];

  return (
    <div className="history-table">
      <div className="history-header">
        <h2>Consultation History</h2>
        <p>Past patient consultations and summaries</p>
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
              <th>Drive Link</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation.id}>
                <td>{consultation.date}</td>
                <td>{consultation.patientName}</td>
                <td>{consultation.diagnosis}</td>
                <td>
                  <a 
                    href={consultation.driveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="drive-link"
                  >
                    <ExternalLink size={16} />
                    View PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {consultations.length === 0 && (
        <div className="empty-state">
          <p>No consultations found. Record your first consultation to see it here.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;