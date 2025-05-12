import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

{/* 
  This page displays the user selected team and season
  Displayed athletes are categorized into Offense, Defense, or Special
  Then grouped by their position
*/}


const CORE_API = 'http://sports.core.api.espn.com/v2/sports/football/leagues/nfl'; //used to get season/teams for filtering
const SITE_API = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl'; //used to get roster
const getTeams = async (season) => {
  const response = await axios.get(`${CORE_API}/seasons/${season}/teams`);
  return response.data;
};

const getSeasons = async () => {
  const response = await axios.get(`${CORE_API}/seasons`);
  return response.data;
};

const getTeamAthletes = async (teamId, season) => {
  const url = `${SITE_API}/teams/${teamId}/roster?season=${season}`;
  const res = await axios.get(url);
  return res.data.athletes?.flatMap(group => group.items) || [];
};

function Home() {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [pendingSeason, setPendingSeason] = useState('');
  const [pendingTeamId, setPendingTeamId] = useState('');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      const seasonsData = await getSeasons();
      if (seasonsData?.items) {
        setSeasons(seasonsData.items);
        const recentSeason = seasonsData.items[1]['$ref'].match(/seasons\/(\d{4})/)[1];
        const storedSeason = localStorage.getItem('selectedSeason') || recentSeason;
        setPendingSeason(storedSeason);
        setSelectedSeason(storedSeason);
      }
    };
    fetchSeasons();
  }, []);

  useEffect(() => {
    if (!selectedSeason) return;

    const fetchTeams = async () => {
      const teamList = await getTeams(selectedSeason);
      if (teamList?.items) {
        const teamDetails = await Promise.all(
          teamList.items.map(async (item) => {
            const res = await axios.get(item.$ref);
            return res.data;
          })
        );
        const filteredTeams = teamDetails.filter(Boolean);
        setTeams(filteredTeams);
        const storedTeamId = localStorage.getItem('selectedTeamId') || filteredTeams[0]?.id;
        setPendingTeamId(storedTeamId);
        setSelectedTeamId(storedTeamId);
      }
    };

    fetchTeams();
  }, [selectedSeason]);

  useEffect(() => {
    if (!selectedSeason || !selectedTeamId) return;

    const fetchPlayers = async () => {
      const roster = await getTeamAthletes(selectedTeamId, selectedSeason);
      setPlayers(roster);
    };

    fetchPlayers();
  }, [selectedSeason, selectedTeamId]);

  //Group players by position
  const groupByPosition = (players) => {
    const grouped = {
      Offense: {},
      Defense: {},
      "Special Teams": {},
    };

    players.forEach((player) => {
      const position = player.position?.abbreviation || 'Unknown';

      if (['QB', 'RB', 'WR', 'TE', 'OL', 'OT', 'C'].includes(position)) {
        if (!grouped["Offense"][position]) {
          grouped["Offense"][position] = [];
        }
        grouped["Offense"][position].push(player);
      } else if (['CB', 'S', 'LB', 'DT', 'DE'].includes(position)) {
        if (!grouped["Defense"][position]) {
          grouped["Defense"][position] = [];
        }
        grouped["Defense"][position].push(player);
      } else if (['LS', 'P', 'PK'].includes(position)) {
        if (!grouped["Special Teams"][position]) {
          grouped["Special Teams"][position] = [];
        }
        grouped["Special Teams"][position].push(player);
      }
    });

    return grouped;
  };

  const groupedPlayers = groupByPosition(players);

  const handleLoadRoster = () => {
    setSelectedSeason(pendingSeason);
    setSelectedTeamId(pendingTeamId);

    //save season and team for when user returns it is on the same page
    localStorage.setItem('selectedSeason', pendingSeason);
    localStorage.setItem('selectedTeamId', pendingTeamId);
  };

  return (
    <div>
      <h1>NFL Team Players</h1>

      <div>
        <label>
          Select Season:{' '}
          <select value={pendingSeason} onChange={(e) => setPendingSeason(e.target.value)}>
            {seasons.map((season, index) => {
              const match = season['$ref'].match(/seasons\/(\d{4})/);
              const year = match ? match[1] : `Unknown-${index}`;
              return (
                <option key={index} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <div>
        <label>
          Select Team:{' '}
          <select value={pendingTeamId} onChange={(e) => setPendingTeamId(e.target.value)}>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.location} {team.name} ({team.abbreviation})
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={handleLoadRoster}
        disabled={!pendingSeason || !pendingTeamId}
      >
        Load Team Roster
      </button>

      {/* Offense */}
      <div>
        <h2>Offense</h2>
        {Object.keys(groupedPlayers["Offense"]).length > 0 ? (
          Object.entries(groupedPlayers["Offense"]).map(([position, players]) => (
            <div key={position}>
              <h3>{position}</h3>
              <div className="grid-container">
                {players.map((player) => (
                  <div key={player.id} className="grid-item">
                    <Link to={`/player/${player.id}`}>
                      {player.fullName || player.displayName || 'Unnamed Player'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No offense players available</p>
        )}
      </div>

      {/* Defense */}
      <div>
        <h2>Defense</h2>
        {Object.keys(groupedPlayers["Defense"]).length > 0 ? (
          Object.entries(groupedPlayers["Defense"]).map(([position, players]) => (
            <div key={position}>
              <h3>{position}</h3>
              <div className="grid-container">
                {players.map((player) => (
                  <div key={player.id} className="grid-item">
                    <Link to={`/player/${player.id}`}>
                      {player.fullName || player.displayName || 'Unnamed Player'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No defense players available</p>
        )}
      </div>

      {/* Special Teams */}
      <div>
        <h2>Special Teams</h2>
        {Object.keys(groupedPlayers["Special Teams"]).length > 0 ? (
          Object.entries(groupedPlayers["Special Teams"]).map(([position, players]) => (
            <div key={position}>
              <h3>{position}</h3>
              <div className="grid-container">
                {players.map((player) => (
                  <div key={player.id} className="grid-item">
                    <Link to={`/player/${player.id}`}>
                      {player.fullName || player.displayName || 'Unnamed Player'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No special teams players available</p>
        )}
      </div>
    </div>
  );
}

export default Home;