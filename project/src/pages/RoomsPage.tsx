import React, { useState } from 'react';
import Layout from '../components/Layout';
import RoomCard from '../components/RoomCard';
import { useBooking } from '../context/BookingContext';
import { RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const RoomsPage: React.FC = () => {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nossas Salas</h1>
            <p className="text-gray-600">
              Consulte a disponibilidade dos espaços para suas reuniões e atividades
            </p>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
          >
            {refreshing || isLoading ? (
              <LoadingSpinner size="small" color="text-blue-600" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            <span>Atualizar</span>
          </button>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600">Carregando salas...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RoomsPage;