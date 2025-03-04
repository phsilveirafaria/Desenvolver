import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import Layout from '../components/Layout';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Calendar, User, Mail, Shield, Clock } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { bookings, rooms } = useBooking();
  
  if (!currentUser) {
    return null;
  }
  
  // Get user's bookings
  const userBookings = bookings.filter(booking => booking.userId === currentUser.id);
  
  // Get room details for each booking
  const bookingsWithRooms = userBookings.map(booking => {
    const room = rooms.find(r => r.id === booking.roomId);
    return { booking, room };
  });
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Perfil do Usuário</h1>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="bg-blue-100 rounded-full p-6 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <User className="h-16 w-16 text-blue-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">{currentUser.name}</h2>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{currentUser.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      {currentUser.isAdmin ? 'Administrador' : 'Usuário'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Minhas Reservas</h2>
          </div>
          
          {bookingsWithRooms.length === 0 ? (
            <div className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Você ainda não tem reservas.</p>
              <Link 
                to="/rooms" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Reservar uma sala
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {bookingsWithRooms.map(({ booking, room }) => (
                <div key={booking.id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{room?.name}</h3>
                      
                      <div className="flex items-center text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {format(parseISO(booking.startTime), "dd 'de' MMMM", { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0">
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-sm
                        ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {booking.status === 'approved' ? 'Aprovado' : 
                         booking.status === 'rejected' ? 'Rejeitado' : 
                         'Pendente'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Link 
                      to={`/rooms/${room?.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver detalhes da sala
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;