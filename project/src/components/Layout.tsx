import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Calendar } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8" />
            <span className="text-2xl font-bold">Desenvolver</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/rooms" className="hover:text-blue-200 flex items-center space-x-1">
              <Calendar className="h-5 w-5" />
              <span>Salas</span>
            </Link>
          </div>
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