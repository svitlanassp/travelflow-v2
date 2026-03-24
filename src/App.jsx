import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './services/auth'
import TripsPage from './pages/TripsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';

const ProtectedRoute = ({ children }) => {
    if (!Auth.isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route 
                    path="/trips" 
                    element={
                        <ProtectedRoute>
                            <TripsPage />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/users" 
                    element={
                        <ProtectedRoute>
                            <UsersPage />
                        </ProtectedRoute>
                    } 
                />

                <Route path="/" element={<Navigate to="/trips" />} />
            </Routes>
        </Router>
    )
}

export default App

