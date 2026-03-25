import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './services/auth'
import TripsPage from './pages/TripsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';

const ProtectedRoute = ({ children }) => {
    if (!Auth.isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AdminRoute = ({ children }) => {
    const isLogged = Auth.isLoggedIn();
    const role = Auth.getRole();

    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    if (role !== 'admin') {
        return <Navigate to="/trips" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />

                <Route path="/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
                <Route path="/users/new" element={<AdminRoute><CreateUserPage /></AdminRoute>} />
                <Route path="/users/:id/edit" element={<AdminRoute><EditUserPage /></AdminRoute>} />

                <Route path="/" element={<Navigate to="/trips" />} />
            </Routes>
        </Router>
    )
}

export default App

