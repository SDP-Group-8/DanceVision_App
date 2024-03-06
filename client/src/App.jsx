import './App.css'
import { Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';

import SelectVideoPage from './pages/SelectVideoPage/SelectVideoPage.jsx';
import DanceScreen from './components/DanceScreen/DanceScreen.jsx';
import ScoringPage from './pages/ScoringPage/ScoringPage.jsx';

function App() {
  return(
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path ="/videos" element={<SelectVideoPage/>}></Route>
          <Route path="/live_comparison" element={<DanceScreen/>}></Route>
          <Route path="/scoring" element={<ScoringPage/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App