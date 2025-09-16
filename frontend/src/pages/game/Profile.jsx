import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
        setProfileData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data. You may need to log in.');
        setLoading(false);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  const { user, stats } = profileData;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>User Profile</h2>
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h3 style={{ marginTop: '20px' }}>Game Stats</h3>
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        {stats ? (
          <>
            <p><strong>Games Played:</strong> {stats.totalGames}</p>
            <p><strong>Kills:</strong> {stats.totalKills}</p>
            <p><strong>Deaths:</strong> {stats.totalDeaths}</p>
            <p><strong>Wins:</strong> {stats.totalWins}</p>
            <p><strong>Last Played:</strong> {new Date(stats.lastPlayed).toLocaleDateString()}</p>
          </>
        ) : (
          <p>No stats available yet. Go play a game!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;