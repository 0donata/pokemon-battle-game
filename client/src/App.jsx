import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.scss";
import BattleScreen from "./pages/BattleScreen";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/battle" element={<BattleScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
