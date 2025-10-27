import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import '../styles/auth.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  
  const { signup, signInWithGoogle, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const { name, email, password, confirmPassword } = formData;

      if (!name || !email || !password || !confirmPassword) {
        setAuthError('Please fill in all fields');
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setAuthError('Please enter a valid email address');
        return;
      }

      if (password.length < 6) {
        setAuthError('Password must be at least 6 characters long');
        return;
      }

      if (password !== confirmPassword) {
        setAuthError('Passwords do not match');
        return;
      }

      await signup(name, email, password);
      setVerificationSent(true);
      
    } catch (err) {
      // Error is already set in the auth hook
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      // Error is already set in the auth hook
    } finally {
      setGoogleLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="verification-sent">
              <CheckCircle size={64} className="success-icon" />
              <h1>Verify Your Email</h1>
              <p>
                We've sent a verification link to <strong>{formData.email}</strong>
              </p>
              <p className="verification-instructions">
                Please check your inbox and click the verification link to activate your account.
                You won't be able to sign in until you verify your email address.
              </p>
              <div className="verification-actions">
                <button 
                  onClick={() => setVerificationSent(false)}
                  className="button button-secondary"
                >
                  Back to Sign Up
                </button>
                <Link to="/login" className="button button-primary">
                  Go to Login
                </Link>
              </div>
              <div className="verification-help">
                <p>Didn't receive the email?</p>
                <ul>
                  <li>Check your spam folder</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Wait a few minutes and try again</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="back-button">
              <ArrowLeft size={20} />
            </Link>
            <h1>Create Account</h1>
            <p>Get started with your free account</p>
          </div>

          {authError && (
            <div className="error-message">
              {authError}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button 
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="google-signin-button"
          >
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google" 
              className="google-logo"
            />
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <User size={18} />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={18} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={18} />
                Password
              </label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Create a password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <small className="form-hint">At least 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <Lock size={18} />
                Confirm Password
              </label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="terms-notice">
            <p>
              By creating an account, you agree to our{' '}
              <a href="/terms" className="auth-link">Terms of Service</a> and{' '}
              <a href="/privacy" className="auth-link">Privacy Policy</a>
            </p>
          </div>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-image">
          <div className="image-content">
            <h2>Start Simplifying Consultations</h2>
            <p>Join medical professionals using AI to save time and improve patient care</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;