import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import SelectVideoPage from "./pages/SelectVideoPage/SelectVideoPage";
import ScoringPage from "./pages/ScoringPage/ScoringPage.jsx";
import SignInUpForm from "./pages/SignInUpForm/SignInUpForm.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import CountdownPage from "./pages/CountdownPage/CountdownPage.jsx";
import LeaderBoard from "./pages/LeaderBoard/LeaderBoard.jsx";

import styles from "./App.module.css";
import PrivateOutlet from "./components/PrivateOutlet.jsx";

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Routes>
          <Route element={<PrivateOutlet />}>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/videos" element={<SelectVideoPage />}></Route>
            <Route path="/scoring" element={<ScoringPage />}></Route>
            <Route path="/countdown" element={<CountdownPage />}></Route>
            <Route path="/leaderboard" element={<LeaderBoard />}></Route>
          </Route>
          <Route path="/login" element={<SignInUpForm />}></Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
