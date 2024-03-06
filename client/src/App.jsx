import { Route, Routes, BrowserRouter as Router} from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import SelectVideoPage from './pages/SelectVideoPage/SelectVideoPage';
import DanceScreen from './components/DanceScreen/DanceScreen.jsx';
import ScoringPage from './pages/ScoringPage/ScoringPage.jsx';

import styles from './App.module.css'

function App() {
  return(
    <div className={styles.App}>
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