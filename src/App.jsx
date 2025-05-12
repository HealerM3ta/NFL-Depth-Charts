import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import PlayerProfile from './components/PlayerProfile.jsx';
import StatisticsPage from './components/StatisticsPage.jsx';
import SplitsPage from './components/SplitsPage.jsx';
import GameLogs from './components/GameLogs.jsx';
import News from './components/News.jsx';
import Bio from './components/Bio.jsx';
import Overview from './components/Overview.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
        <Route path="/player/:id/statistics" element={<StatisticsPage />} />
        <Route path="/player/:id/splits" element={<SplitsPage />} />
        <Route path="/player/:id/gamelogs" element={<GameLogs />} />
        <Route path="/player/:id/news" element={<News />} />
        <Route path="/player/:id/bio" element={<Bio />} />
        <Route path="/player/:id/overview" element={<Overview />} />
      </Routes>
    </Router>
  );
}

export default App;
