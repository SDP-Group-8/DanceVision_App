import './App.css'
import { Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';

import SelectVideoPage from './pages/SelectVideoPage/SelectVideoPage.jsx';
import ScoringPage from './pages/ScoringPage.jsx';

function App() {
  return(
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path ="/videos" element={<SelectVideoPage/>}></Route> */}
          <Route path="/" element={<ScoringPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App