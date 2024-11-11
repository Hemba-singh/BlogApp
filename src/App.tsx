import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';
import { Login } from './pages/Login';
import { Blog } from './pages/Blog';
import { NewPost } from './pages/NewPost';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Blog />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-post"
            element={
              <AdminRoute>
                <NewPost />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;