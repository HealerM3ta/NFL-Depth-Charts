import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

{/* 
  This page displays the player's Game Logs
  It has the game date, opponent, score, week, and result
  It is not in chronological order because of lack of time
*/}

const GameLogPage = () => {
  const { id } = useParams();
  const [gameLogs, setGameLogs] = useState([]);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchGameLog = async () => {
      try {
        const response = await axios.get(
          `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}/gamelog?season=${selectedYear}`
        );

        const data = response.data;

        const seasonOptions = data.filters?.find(filter => filter.name === 'season')?.options || [];
        setAvailableYears(seasonOptions);

        const events = Object.values(data.events);

        if (events.length === 0) {
          setGameLogs([]);
          return;
        }

        const gameLogData = events.map(event => ({
          gameDate: event.gameDate,
          gameResult: event.gameResult,
          score: event.score,
          opponent: event.opponent.displayName,
          week: event.week,
          team: event.team.abbreviation,
        }));

        setGameLogs(gameLogData);
      } catch {
        setError('No available information.');
      }
    };

    fetchGameLog();
  }, [id, selectedYear]);

  if (error) return <div style={{ color: 'white' }}>{error}</div>;
  if (!gameLogs.length) return <div style={{ color: 'white' }}>Loading gamelog...</div>;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1>Player {selectedYear} Game Logs</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="year-select" style={{ marginRight: '0.5rem' }}>Select Year:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '0.5rem',
            border: '1px solid #444',
            borderRadius: '4px'
          }}
        >
          {availableYears.map(year => (
            <option key={year.value} value={year.value}>
              {year.displayValue}
            </option>
          ))}
        </select>
      </div>

      <table style={{ borderCollapse: 'collapse', width: '100%', color: 'white' }}>
        <thead>
          <tr>
            <th style={{
              border: '1px solid #444',
              padding: '0.5rem',
              backgroundColor: '#222',
              textAlign: 'left',
              width: '150px'
            }}>Game Date</th>
            <th style={{
              border: '1px solid #444',
              padding: '0.5rem',
              backgroundColor: '#222',
              textAlign: 'center'
            }}>Opponent</th>
            <th style={{
              border: '1px solid #444',
              padding: '0.5rem',
              backgroundColor: '#222',
              textAlign: 'center'
            }}>Score</th>
            <th style={{
              border: '1px solid #444',
              padding: '0.5rem',
              backgroundColor: '#222',
              textAlign: 'center'
            }}>Week</th>
            <th style={{
              border: '1px solid #444',
              padding: '0.5rem',
              backgroundColor: '#222',
              textAlign: 'center'
            }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {gameLogs.map((log, index) => (
            <tr key={index}>
              <td style={{
                border: '1px solid #333',
                padding: '0.5rem',
                backgroundColor: '#1a1a1a',
              }}>{log.gameDate.split('T')[0]}</td>
              <td style={{
                border: '1px solid #333',
                padding: '0.5rem',
                backgroundColor: '#1a1a1a',
                textAlign: 'center',
              }}>{log.opponent}</td>
              <td style={{
                border: '1px solid #333',
                padding: '0.5rem',
                backgroundColor: '#1a1a1a',
                textAlign: 'center',
              }}>{log.score}</td>
              <td style={{
                border: '1px solid #333',
                padding: '0.5rem',
                backgroundColor: '#1a1a1a',
                textAlign: 'center',
              }}>{log.week}</td>
              <td style={{
                border: '1px solid #333',
                padding: '0.5rem',
                backgroundColor: '#1a1a1a',
                textAlign: 'center',
              }}>{log.gameResult}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="back-button-container">
        <button className="back-button" onClick={() => window.history.back()}>Back to Player Profile</button>
      </div>
    </div>
  );
};

export default GameLogPage;
