import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

{/* 
  This page displays the most relevant information from other pages
  Stats, Game Log, and News
*/}

const PlayerOverview = () => {
  const { id } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}/overview`)
      .then((response) => response.json())
      .then((data) => {
        setPlayerData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ backgroundColor: '#121212', color: 'white', padding: '1rem', minHeight: '100vh' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ backgroundColor: '#121212', color: 'white', padding: '1rem', minHeight: '100vh' }}>{error}</div>;
  }

  if (playerData) {
    const { statistics, news, splits, gameLog } = playerData;

    const statisticsCategories = Array.isArray(statistics?.categories) ? statistics.categories : [];
    const gameLogEvents = gameLog?.events ? Object.values(gameLog.events) : [];

    const uniqueNews = Array.isArray(news)
      ? news.filter((item, index, self) =>
          index === self.findIndex((t) => t.headline === item.headline)
        )
      : [];

    return (
      <div style={{ backgroundColor: '#121212', color: 'white', padding: '1rem', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Player Overview</h1>

        {/* Player Statistics */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Statistics</h2>
          {statistics?.splits?.length > 0 ? (
            statistics.splits.map((split, splitIndex) => (
              <div key={splitIndex} style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600' }}>{split.displayName}</h3>
                <ul style={{ color: '#ccc' }}>
                  {split.stats.map((stat, statIndex) => (
                    <li key={statIndex}>
                      <strong>{statistics.displayNames[statIndex]}:</strong> {stat}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p style={{ color: '#ccc' }}>No statistics available</p>
          )}
        </section>

        {/* Recent Game Log */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Games</h2>
          {gameLogEvents.length > 0 ? (
            gameLogEvents.map((event, index) => (
              <div key={index} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: '600' }}>
                  {event.atVs} {event.opponent?.displayName} ({event.gameResult})
                </h3>
                <p style={{ color: '#ccc' }}>{new Date(event.gameDate).toLocaleDateString()}</p>
                <p style={{ color: '#ccc' }}>Score: {event.score}</p>
                <p style={{ color: '#ccc' }}>Week: {event.week}</p>
                <ul style={{ color: '#ccc' }}>
                  {event.statistics?.map((stat, statIndex) => (
                    <li key={statIndex}>
                      <strong>{stat.displayName}:</strong> {stat.value}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p style={{ color: '#ccc' }}>No recent games available</p>
          )}
        </section>

        {/* Player News */}
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>News</h2>
          {uniqueNews.length > 0 ? (
            uniqueNews.map((newsItem, index) => (
              <div key={index} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: '600' }}>{newsItem.headline}</h3>
                <p style={{ color: '#ccc' }}>{newsItem.summary}</p>
              </div>
            ))
          ) : (
            <p style={{ color: '#ccc' }}>No news available</p>
          )}
          <div className="back-button-container">
            <button className="back-button" onClick={() => window.history.back()}>Back to Player Profile</button>
          </div>
        </section>
      </div>
    );
  }

  return null;
};

export default PlayerOverview;
