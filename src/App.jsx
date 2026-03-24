import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TripsPage from './pages/TripsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/users" element={<UsersPage />} />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App

