import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AudioRecorder from '../components/dashboard/AudioRecorder';
import TranscriptViewer from '../components/dashboard/TranscriptViewer';
import SummaryEditor from '../components/dashboard/SummaryEditor';
import HistoryTable from '../components/dashboard/HistoryTable';
import { useAuth } from '../hooks/useAuth'; // Add this import
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth(); // Add this line to get the user
  const [activeTab, setActiveTab] = useState('record');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordingComplete = async (audioBlob) => {
    console.log('Audio recording completed:', audioBlob);
    
    // Simulate transcription
    const mockTranscript = `DOCTOR: Good morning, how are you feeling today?
PATIENT: Not too bad, doctor. Still having some headaches though.
DOCTOR: On a scale of 1-10, how severe is the pain?
PATIENT: About a 6 or 7. It's been persistent.`;
    
    setTranscript(mockTranscript);
    setActiveTab('transcript');
  };

  const handleTranscriptSave = async (editedTranscript) => {
    console.log('Saving transcript:', editedTranscript);
    
    // Mock summary generation
    const mockSummary = {
      patientName: 'John Smith',
      age: '45',
      gender: 'Male',
      symptoms: 'Persistent headaches, pain level 6-7/10',
      history: 'No significant past medical history',
      examination: 'Neurological examination normal',
      diagnosis: 'Tension headaches',
      prescription: 'Ibuprofen 400mg as needed',
      followUp: 'Return in 2 weeks if symptoms persist'
    };
    
    setSummary(mockSummary);
    setActiveTab('summary');
  };

  const handleSummarySave = async (summaryData) => {
    console.log('Saving summary:', summaryData);
    alert('Summary saved successfully!');
    setActiveTab('history');
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h1>Welcome, {user?.name || user?.email || 'Doctor'}!</h1>
        <p>Ready to record your next patient consultation?</p>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'record' ? 'active' : ''}`}
              onClick={() => setActiveTab('record')}
            >
              🎤 Record Consultation
            </button>
            <button 
              className={`nav-item ${activeTab === 'transcript' ? 'active' : ''}`}
              onClick={() => setActiveTab('transcript')}
              disabled={!transcript}
            >
              📝 Transcript
            </button>
            <button 
              className={`nav-item ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
              disabled={!summary}
            >
              📄 Summary
            </button>
            <button 
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📚 History
            </button>
            <Link to="/settings" className="nav-item">
              ⚙️ Settings
            </Link>
          </nav>
        </div>

        <div className="dashboard-content">
          {activeTab === 'record' && (
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          )}
          
          {activeTab === 'transcript' && transcript && (
            <TranscriptViewer 
              transcript={transcript}
              onSave={handleTranscriptSave}
            />
          )}
          
          {activeTab === 'summary' && summary && (
            <SummaryEditor 
              summary={summary}
              onSave={handleSummarySave}
            />
          )}
          
          {activeTab === 'history' && (
            <HistoryTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;