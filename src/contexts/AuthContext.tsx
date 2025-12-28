import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 On app load → verify token via /profile
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log(token);

    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Unauthorized');
        console.log("here");
        return res.json();
      })
      .then((data: User & { role: UserRole }) => {
        console.log("threr");
        setUser(data);
        setRole(data.role);
        setIsAuthenticated(true);
      })
      .catch(() => {
        console.log("buhuhuu")
        // sessionStorage.removeItem('token');
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Logout only
  const logout = () => {
    sessionStorage.removeItem('token');

    setUser(null);
    setRole(null);
    setIsAuthenticated(false);

    navigate('/login');
  };

  if (loading) return null; // or <Loader />

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
