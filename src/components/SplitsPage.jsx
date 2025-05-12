import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Statisticspage.css';

{/* 
  This page displays information about the player's split
  It allows for selecting the year with 2024 as default year
*/}

const SplitsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [labels, setLabels] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchSplits = async () => {
      const response = await axios.get(
        `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}/splits?season=${selectedYear}`
      );

      const data = response.data;
      setLabels(data.labels || []);

      const seasonOptions = data.filters?.find(filter => filter.name === 'season')?.options || [];
      setAvailableYears(seasonOptions);

      const processedStats = data.splitCategories
        .filter(cat => Array.isArray(cat.splits))
        .map(cat => ({
          displayName: cat.displayName,
          splits: cat.splits.map(split => ({
            name: split.displayName,
            stats: split.stats
          }))
        }));

      setCategoryStats(processedStats);
    };

    fetchSplits().catch(() => setError('Failed to load splits data.'));
  }, [id, selectedYear]);

  if (error) return <div className="error-text">{error}</div>;
  if (!labels.length || !categoryStats.length) return <div className="error-text">No available information.</div>;

  return (
    <div className="stats-container">
      <h1>Player {selectedYear} Splits</h1>

      <div className="year-select-container">
        <label htmlFor="year-select" className="year-select-label">Select Year:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="year-select-dropdown"
        >
          {availableYears.map(year => (
            <option key={year.value} value={year.value}>
              {year.displayValue}
            </option>
          ))}
        </select>
      </div>

      {categoryStats.map((cat, catIndex) => (
        <div key={catIndex} className="split-category">
          <h2>{cat.displayName}</h2>
          <table className="split-table">
            <thead>
              <tr>
                <th className="split-header split-name-col">Split</th>
                {labels.map((label, i) => (
                  <th key={i} className="split-header">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cat.splits.map((split, splitIndex) => (
                <tr key={splitIndex}>
                  <td className="split-name">{split.name}</td>
                  {labels.map((_, i) => (
                    <td key={i} className="split-cell">
                      {split.stats[i] ?? 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>Back to Player Profile</button>
      </div>
    </div>
  );
};

export default SplitsPage;
