import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Calendar from '../components/Calendar';
import { useBooking } from '../context/BookingContext';
import { Users, MapPin, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoom, refreshData, isLoading } = useBooking();
  const [refreshing, setRefreshing] = useState(false);
  
  const room = getRoom(id || '');
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };
  
  if (!room) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Sala não encontrada</h2>
          <button 
            onClick={() => navigate('/rooms')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Voltar para salas
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={room.imageUrl} 
                alt={room.name} 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
              
              <div className="flex items-center text-gray-700 mb-4">
                <Users className="h-5 w-5 mr-2" />
                <span>Capacidade: {room.capacity} pessoas</span>
              </div>
              
              <div className="flex items-start mb-6">
                <MapPin className="h-5 w-5 mr-2 mt-1 text-gray-700" />
                <div>
                  <h3 className="font-medium">Localização</h3>
                  <p className="text-gray-600">Desenvolver Coworking, 2º andar</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Descrição</h3>
                <p className="text-gray-600">{room.description}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="text-blue-800">
                  Consulte a disponibilidade da sala no calendário abaixo.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Disponibilidade</h2>
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
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600">Carregando disponibilidade...</p>
            </div>
          ) : (
            <Calendar room={room} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RoomDetailPage;