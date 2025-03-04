import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../types';
import { Users } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <Link 
      to={`/rooms/${room.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <Users className="h-5 w-5 mr-1" />
          <span>Capacidade: {room.capacity} pessoas</span>
        </div>
        
        <p className="text-gray-600 line-clamp-2">{room.description}</p>
        
        <div className="mt-4 pt-3 border-t">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Ver disponibilidade
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;