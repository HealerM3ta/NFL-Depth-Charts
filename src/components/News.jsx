import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

{/* 
  This page displays relevant news about the player
  It also links to the articles from espn, these links were found through the API
*/}

const PlayerNewsPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const overviewResponse = await axios.get(
          `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}/overview`
        );
        const overviewData = overviewResponse.data;
        const playerNews = overviewData.news || [];

        const uniqueNews = playerNews.filter((item, index, self) =>
          index === self.findIndex((t) => t.headline === item.headline)
        );
        setNews(uniqueNews);

        const profileResponse = await axios.get(
          `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${id}`
        );
        const playerData = profileResponse.data;
        const fullName = playerData.athlete.fullName || playerData.athlete.displayName || "Unknown Player";
        setPlayerName(fullName);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  return (
    <div style={{ padding: "1rem", backgroundColor: "#121212", color: "white", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        {playerName} - News
      </h2>

      {loading ? (
        <p>Loading news...</p>
      ) : news.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {news.map((item, index) => (
            <li key={index} style={{ borderBottom: "1px solid #333", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                {item.headline}
              </h3>
              <p style={{ color: "#ccc", marginBottom: "0.5rem" }}>{item.summary}</p>
              {item.links?.web?.href && (
                <a
                  href={item.links.web.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#38bdf8", textDecoration: "underline" }}
                >
                  Read more →
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No news available.</p>
      )}
      <div className="back-button-container">
        <button className="back-button" onClick={() => window.history.back()}>Back to Player Profile</button>
      </div>
    </div>
  );
};

export default PlayerNewsPage;
