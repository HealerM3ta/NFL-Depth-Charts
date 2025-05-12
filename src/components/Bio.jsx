import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

{/* 
  This page displays a player's
  - Position
  - Jersey number
  - College
  - Birthdate
  - Age
  - Height
  - Weight
  - Birth Place
  - Draft
*/}

const BASE_URL = 'http://sports.core.api.espn.com/v2/sports/football/leagues/nfl';

const BioPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [college, setCollege] = useState(null);
  const [statsAvailable, setStatsAvailable] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerResponse = await axios.get(`${BASE_URL}/athletes/${id}`);
        setPlayer(playerResponse.data);

        if (playerResponse.data.college) {
          const collegeResponse = await axios.get(playerResponse.data.college.$ref);
          setCollege(collegeResponse.data);
        }

        try {
          const statsResponse = await axios.get(
            `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}/stats`
          );
          if (statsResponse.data?.categories?.length > 0) {
            setStatsAvailable(true);
          }
        } catch {
          setStatsAvailable(false);
        }
      } catch {
        setError('Failed to load player profile.');
      }
    };

    fetchPlayer();
  }, [id]);

  const formatDateOfBirth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (error) {
    return (
      <div style={{ backgroundColor: '#121212', color: 'white', padding: '1rem', minHeight: '100vh' }}>
        {error}
      </div>
    );
  }

  if (!player) {
    return (
      <div style={{ backgroundColor: '#121212', color: 'white', padding: '1rem', minHeight: '100vh' }}>
        Loading player profile...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        {player.fullName || player.displayName}
      </h1>

      {player.headshot?.href && (
        <img
          src={player.headshot.href}
          alt={player.fullName}
          style={{ width: '100%', maxWidth: '400px', height: 'auto', marginBottom: '2rem', borderRadius: '8px' }}
        />
      )}

      <div style={{ fontSize: '1.125rem', lineHeight: '1.75rem' }}>
        <p><strong>Position:</strong> {player.position?.displayName || 'N/A'}</p>
        <p><strong>Jersey:</strong> #{player.jersey || 'N/A'}</p>
        <p><strong>College:</strong> {college ? college.name : 'N/A'}</p>
        <p><strong>Birthdate:</strong> {formatDateOfBirth(player.dateOfBirth)}</p>
        <p><strong>Age:</strong> {player.age || 'N/A'}</p>
        <p><strong>Height:</strong> {player.displayHeight || 'N/A'}</p>
        <p><strong>Weight:</strong> {player.displayWeight || 'N/A'}</p>
        <p><strong>Birth Place:</strong> {`${player.birthPlace?.city || ''} ${player.birthPlace?.state || ''} ${player.birthPlace?.country || ''}`.trim()}</p>
        <p><strong>Draft:</strong> {`${player.draft?.year || 'N/A'} Round: ${player.draft?.round || 'N/A'} Pick: ${player.draft?.selection || 'N/A'} ${player.draft?.team?.name || ''}`.trim()}</p>
        <div className="back-button-container">
          <button className="back-button" onClick={() => window.history.back()}>Back to Player Profile</button>
        </div>
      </div>
    </div>
  );
};

export default BioPage;
