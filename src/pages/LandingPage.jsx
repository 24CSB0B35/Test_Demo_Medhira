import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { Mic, FileText, Cloud } from 'lucide-react';
import '../styles/landing.css';

const LandingPage = () => {
  const features = [
    {
      icon: <Mic size={48} />,
      title: 'Audio Recording & Transcription',
      description: 'Record patient consultations and get accurate transcriptions automatically.'
    },
    {
      icon: <FileText size={48} />,
      title: 'AI-Generated Structured Summaries',
      description: 'Transform conversations into organized medical summaries with key insights.'
    },
    {
      icon: <Cloud size={48} />,
      title: 'Secure Cloud Storage',
      description: 'Automatically save summaries to Google Drive with enterprise-grade security.'
    }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Simplify Patient Consultations
          </h1>
          <p className="hero-subtitle">
            Record, summarize, and securely store consultation notes automatically.
          </p>
          <Link to="/login" className="cta-button">
            Get Started →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Patient-Doctor Summarizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;