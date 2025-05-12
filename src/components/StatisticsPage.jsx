import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './StatisticsPage.css'; 

{/* 
  This page displays stats by type then by season
  e.g. Passing Statistics
  Season 2018
*/}

const StatisticsPage = () => {
  const { id } = useParams();
  const [statCategories, setStatCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsUrl = `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}/stats`;
        const response = await axios.get(statsUrl);

        const categories = response.data?.categories || [];

        if (categories.length === 0) {
          setError('No statistics available.');
        } else {
          setStatCategories(categories);
        }
      } catch (err) {
        setError('Could not load statistics.');
      }
    };

    fetchStats();
  }, [id]);

  if (error) return <div className="error-message">{error}</div>;
  if (statCategories.length === 0) return <div className="loading-message">Loading player statistics...</div>;

  return (
    <div className="statistics-page">
      <h2 className="page-title">Player Statistics</h2>

      {statCategories.map((category, catIndex) => (
        <div key={catIndex} className="category-section">
          <h3 className="category-title">{category.displayName} Statistics</h3>

          {category.statistics?.map((seasonData, seasonIndex) => (
            <div key={seasonIndex} className="season-section">
              <h4 className="season-title">
                Season {seasonData.season?.displayName || `#${seasonIndex + 1}`}
              </h4>
              <div className="table-container">
                <table className="stats-table">
                  <thead>
                    <tr>
                      {category.labels.map((label, i) => (
                        <th key={i} className="table-header">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {seasonData.stats.map((value, i) => (
                        <td key={i} className="table-cell">{value}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="back-link">
        <Link to={`/player/${id}`} className="back-button">
          ← Back to Player Profile
        </Link>
      </div>
    </div>
  );
};

export default StatisticsPage;
