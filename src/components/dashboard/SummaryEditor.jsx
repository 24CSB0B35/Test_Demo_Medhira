import React, { useState } from 'react';
import { Save, Upload, Check, X, Cloud } from 'lucide-react';
import googleDriveService from '../../services/googleDrive';

const SummaryEditor = ({ summary, onSave }) => {
  const [formData, setFormData] = useState(summary);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!googleDriveService.isConnected()) {
      alert('Please connect Google Drive in Settings before saving summaries.');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const uploadResult = await googleDriveService.uploadSummary(formData);
      
      if (uploadResult.success) {
        setUploadStatus({
          type: 'success',
          message: uploadResult.message,
          driveLink: uploadResult.driveLink
        });
        
        // Call parent save handler with drive info
        onSave({
          ...formData,
          driveLink: uploadResult.driveLink,
          fileId: uploadResult.fileId,
          fileName: uploadResult.fileName,
          uploadedAt: new Date().toISOString()
        });
      } else {
        setUploadStatus({
          type: 'error',
          message: uploadResult.message
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Unexpected error: ${error.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="summary-editor">
      <div className="summary-header">
        <h2>Medical Summary</h2>
        <p>Review and edit the AI-generated summary</p>
        
        {!googleDriveService.isConnected() && (
          <div className="drive-warning">
            <Cloud size={16} />
            <span>Google Drive not connected. Connect in Settings to save summaries.</span>
          </div>
        )}
      </div>

      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.type}`}>
          {uploadStatus.type === 'success' ? <Check size={18} /> : <X size={18} />}
          <span>{uploadStatus.message}</span>
          {uploadStatus.driveLink && (
            <a 
              href={uploadStatus.driveLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="drive-link"
            >
              View in Drive
            </a>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="summary-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="patientName">Patient Name *</label>
            <input
              id="patientName"
              type="text"
              value={formData.patientName}
              onChange={(e) => handleChange('patientName', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              id="age"
              type="text"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <input
              id="gender"
              type="text"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="symptoms">Symptoms & Chief Complaint *</label>
          <textarea
            id="symptoms"
            value={formData.symptoms}
            onChange={(e) => handleChange('symptoms', e.target.value)}
            className="form-textarea"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="history">Medical History</label>
          <textarea
            id="history"
            value={formData.history}
            onChange={(e) => handleChange('history', e.target.value)}
            className="form-textarea"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="examination">Examination Findings</label>
          <textarea
            id="examination"
            value={formData.examination}
            onChange={(e) => handleChange('examination', e.target.value)}
            className="form-textarea"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="diagnosis">Diagnosis *</label>
          <textarea
            id="diagnosis"
            value={formData.diagnosis}
            onChange={(e) => handleChange('diagnosis', e.target.value)}
            className="form-textarea"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prescription">Prescription & Treatment</label>
          <textarea
            id="prescription"
            value={formData.prescription}
            onChange={(e) => handleChange('prescription', e.target.value)}
            className="form-textarea"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="followUp">Follow-Up Instructions</label>
          <textarea
            id="followUp"
            value={formData.followUp}
            onChange={(e) => handleChange('followUp', e.target.value)}
            className="form-textarea"
            rows={2}
          />
        </div>

        <button 
          type="submit" 
          className="button button-primary save-button"
          disabled={isUploading || !googleDriveService.isConnected()}
        >
          {isUploading ? (
            <>
              <div className="loading-spinner"></div>
              Uploading to Google Drive...
            </>
          ) : (
            <>
              <Upload size={18} />
              Save to Google Drive
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SummaryEditor;