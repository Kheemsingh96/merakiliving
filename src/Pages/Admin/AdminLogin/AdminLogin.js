import React, { useState } from 'react';
import './AdminLogin.css';
import logo from '../../../assets/images/logo.avif';
import { API_CONFIG_URL } from '../../../config/api';
import { safeParseResponse } from '../../../utils/apiHelper';
import OptimizedImage from '../../../components/Common/OptimizedImage';

export default function AdminLogin({ setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // 1. Fetch all admins to get the ID for the entered username
      const resAdmins = await fetch(`${API_CONFIG_URL}/api_settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_admins' })
      });
      const parsedAdmins = await safeParseResponse(resAdmins);
      const dataAdmins = parsedAdmins.data;
      
      if (!dataAdmins || dataAdmins.status !== 'success' || !Array.isArray(dataAdmins.data)) {
        setError(parsedAdmins.error || 'Login failed. Cannot connect to authentication service.');
        setIsLoading(false);
        return;
      }
      
      // Find the admin by username (case-insensitive)
      const admin = dataAdmins.data.find(a => a.username && a.username.toLowerCase() === cleanUsername.toLowerCase());
      
      if (!admin) {
        setError('Invalid admin credentials. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // 2. Validate the password by using the existing update_account verification logic
      const resAuth = await fetch(`${API_CONFIG_URL}/api_settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_account',
          admin_id: admin.id,
          current_password: password
        })
      });
      const parsedAuth = await safeParseResponse(resAuth);
      const dataAuth = parsedAuth.data || {};
      
      // If the backend returns "Current password is incorrect.", authentication failed.
      // If it returns "No changes provided." (with status error), the password was verified successfully!
      if (dataAuth.message === 'Current password is incorrect.') {
        setError('Invalid admin credentials. Please try again.');
      } else if (dataAuth.message === 'No changes provided.') {
        // Authentication passed
        sessionStorage.setItem('meraki_admin_auth', 'true');
        setCurrentPage('admin-dashboard');
      } else {
        // Any other response (success, missing fields, etc) is treated as an error since we provided no changes
        setError('Invalid admin credentials. Please try again.');
      }
      
    } catch {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <OptimizedImage src={logo} alt="Meraki Logo" className="admin-login-logo" loading="eager" fetchPriority="high" decoding="async" noWrapper={true} />
        <h2 className="admin-login-title">Admin Access</h2>
        <p className="admin-login-subtitle">Secure login for Homestay management</p>
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-login-form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="admin-login-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              disabled={isLoading}
              required 
            />
          </div>
          <div className="admin-login-form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="admin-login-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              required 
            />
          </div>
          <button type="submit" className="admin-login-btn" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}