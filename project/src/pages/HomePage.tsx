import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useBooking } from '../context/BookingContext';
import { Building, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { rooms, refreshData, isLoading } = useBooking();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white rounded-xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Espaços de trabalho que inspiram</h1>
            <p className="text-xl mb-8">
              Bem-vindo ao Desenvolver Coworking, onde ideias ganham vida e conexões são formadas.
            </p>
            <Link 
              to="/rooms" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Ver salas disponíveis
            </Link>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Por que escolher o Desenvolver?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Espaços modernos</h3>
              <p className="text-gray-600">
                Ambientes projetados para produtividade e conforto, com infraestrutura completa.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visualize a disponibilidade</h3>
              <p className="text-gray-600">
                Consulte facilmente os horários disponíveis para cada sala.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Atendimento premium</h3>
              <p className="text-gray-600">
                Equipe dedicada para garantir que sua experiência seja sempre excelente.
              </p>
            </div>
          </div>
        </section>
        
        {/* Rooms Preview Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Nossas salas</h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
              >
                {refreshing || isLoading ? (
                  <LoadingSpinner size="small" color="text-blue-600" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                <span>Atualizar</span>
              </button>
              <Link 
                to="/rooms" 
                className="text-blue-600 hover:underline"
              >
                Ver todas
              </Link>
            </div>
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600">Carregando salas...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map(room => (
                <Link 
                  key={room.id}
                  to={`/rooms/${room.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={room.imageUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
        
        {/* CTA Section */}
        <section className="bg-gray-100 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Conheça nossos espaços</h2>
          <p className="text-lg text-gray-700 mb-6">
            Veja a disponibilidade das nossas salas e escolha o espaço ideal para suas reuniões e trabalho.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/rooms" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Ver salas
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;