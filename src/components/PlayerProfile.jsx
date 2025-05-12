import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

{/* 
  This code displays the player profiles
  it has links to 
    - Statistics
    - Splits
    - Game Logs
    - News
    - Overview
    - Bio

*/}


const BASE_URL = 'http://sports.core.api.espn.com/v2/sports/football/leagues/nfl';

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [college, setCollege] = useState(null);
  const [statsAvailable, setStatsAvailable] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      const playerResponse = await axios.get(`${BASE_URL}/athletes/${id}`);
      setPlayer(playerResponse.data);

      if (playerResponse.data.college) {
        const collegeResponse = await axios.get(playerResponse.data.college.$ref);
        setCollege(collegeResponse.data);
      }

      const statsResponse = await axios.get(
        `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}/stats`
      );
      if (statsResponse.data?.categories?.length > 0) {
        setStatsAvailable(true);
      }
    };

    fetchPlayer();
  }, [id]);

  const formatDateOfBirth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!player) return <div className="p-4">Loading player profile...</div>;

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-4">{player.fullName || player.displayName}</h1>
        {player.headshot?.href && (
          <img
            src={player.headshot.href}
            alt={player.fullName}
            className="w-1/2 max-w-xs h-auto mb-6 rounded shadow"
          />
        )}

        <div className="button-container">
          {statsAvailable ? (
            <>
              <Link
                to={`/player/${id}/statistics`}
                className="px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition ease-in-out duration-200"
              >
                View Statistics
              </Link>
              <Link
                to={`/player/${id}/splits`}
                className="px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition ease-in-out duration-200"
              >
                View Splits
              </Link>
              <Link
                to={`/player/${id}/gamelogs`}
                className="px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition ease-in-out duration-200"
              >
                View Game Logs
              </Link>
              <Link
                to={`/player/${id}/news`}
                className="px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition ease-in-out duration-200"
              >
                View News
              </Link>
              <Link
                to={`/player/${id}/overview`}
                className="px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition ease-in-out duration-200"
              >
                View Overview
              </Link>
            </>
          ) : (
            <p className="text-gray-600 italic">No additional data available for this player.</p>
          )}

          <Link
            to={`/player/${id}/bio`}
            className="px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition ease-in-out duration-200"
          >
            View Bio
          </Link>
        </div>
      </div>

      <div className="button-container">
        <Link to="/" className="back-to-home">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PlayerProfile;
