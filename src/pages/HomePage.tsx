import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome!</h1>
      {currentUser && <p>Current User Email: {currentUser.email}</p>}
      {userData && (
        <>
          <p>User Data from Backend:</p>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
