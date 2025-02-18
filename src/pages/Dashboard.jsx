import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('https://your-backend-url.onrender.com/api/user/profile', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {profile && <p>Email: {profile.email}</p>}
    </div>
  );
};

export default Dashboard;
