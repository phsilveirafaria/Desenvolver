import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, Calendar, LogOut, User, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8" />
            <span className="text-2xl font-bold">Desenvolver</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link to="/rooms" className="hover:text-blue-200 flex items-center space-x-1">
                <Calendar className="h-5 w-5" />
                <span>Salas</span>
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="hover:text-blue-200 flex items-center space-x-1">
                  <Users className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
              
              <Link to="/profile" className="hover:text-blue-200 flex items-center space-x-1">
                <User className="h-5 w-5" />
                <span>{currentUser?.name}</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="hover:text-blue-200 flex items-center space-x-1"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            &copy; {new Date().getFullYear()} Desenvolver Coworking. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;