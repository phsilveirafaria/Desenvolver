import React from 'react';
import Layout from '../components/Layout';
import RoomCard from '../components/RoomCard';
import { useBooking } from '../context/BookingContext';

const RoomsPage: React.FC = () => {
  const { rooms } = useBooking();
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Nossas Salas</h1>
          <p className="text-gray-600">
            Escolha o espaço ideal para suas reuniões e atividades
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RoomsPage;