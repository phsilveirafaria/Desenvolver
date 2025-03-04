import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto text-center py-12">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
        <p className="text-gray-600 mb-8">
          Você não tem permissão para acessar esta página. Esta área é restrita a administradores.
        </p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;