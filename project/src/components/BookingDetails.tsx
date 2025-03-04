import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Booking, Room } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User } from 'lucide-react';

interface BookingDetailsProps {
  booking: Booking;
  room: Room;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  booking, 
  room, 
  onClose, 
  onApprove, 
  onReject, 
  onDelete 
}) => {
  const { isAdmin, currentUser } = useAuth();
  const isOwner = currentUser?.id === booking.userId;
  const canManage = isAdmin || isOwner;
  
  const startTime = parseISO(booking.startTime);
  const endTime = parseISO(booking.endTime);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Detalhes da Reserva</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="font-medium text-gray-700">Sala</h3>
          <p className="text-lg">{room.name}</p>
        </div>
        
        <div className="flex items-start space-x-2">
          <User className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-700">Usuário</h3>
            <p>{booking.userName}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-700">Data</h3>
            <p>{format(startTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-700">Horário</h3>
            <p>{format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700">Status</h3>
          <div className={`
            inline-block px-2 py-1 rounded-full text-sm
            ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
              booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'}
          `}>
            {booking.status === 'approved' ? 'Aprovado' : 
             booking.status === 'rejected' ? 'Rejeitado' : 
             'Pendente'}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Fechar
        </button>
        
        {isAdmin && booking.status === 'pending' && (
          <>
            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Rejeitar
            </button>
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Aprovar
            </button>
          </>
        )}
        
        {canManage && (
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;