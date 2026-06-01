import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">TaskFlow</span>
          <span className="text-xs text-gray-400 hidden sm:block">— Stay organized</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
