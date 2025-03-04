import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useBooking } from '../context/BookingContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { bookings, rooms, updateBookingStatus, deleteBooking } = useBooking();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get room details for each booking
  const bookingsWithRooms = bookings.map(booking => {
    const room = rooms.find(r => r.id === booking.roomId);
    return { booking, room };
  });
  
  // Filter bookings based on status and search term
  const filteredBookings = bookingsWithRooms.filter(({ booking, room }) => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = 
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    return matchesFilter && matchesSearch;
  });
  
  const handleApprove = (bookingId: string) => {
    updateBookingStatus(bookingId, 'approved');
  };
  
  const handleReject = (bookingId: string) => {
    updateBookingStatus(bookingId, 'rejected');
  };
  
  const handleDelete = (bookingId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      deleteBooking(bookingId);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Painel de Administração</h1>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold">Gerenciar Reservas</h2>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nome ou sala..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas as reservas</option>
                  <option value="pending">Pendentes</option>
                  <option value="approved">Aprovadas</option>
                  <option value="rejected">Rejeitadas</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sala
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhuma reserva encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map(({ booking, room }) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{booking.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            to={`/rooms/${room?.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {room?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(parseISO(booking.startTime), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            inline-block px-2 py-1 rounded-full text-xs
                            ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}
                          `}>
                            {booking.status === 'approved' ? 'Aprovado' : 
                             booking.status === 'rejected' ? 'Rejeitado' : 
                             'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(booking.id)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Aprovar"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleReject(booking.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Rejeitar"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(booking.id)}
                              className="text-gray-600 hover:text-gray-800"
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Estatísticas</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-xl font-bold mb-1">
                {bookings.length}
              </div>
              <div className="text-gray-600">Total de reservas</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 text-xl font-bold mb-1">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-gray-600">Reservas pendentes</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-xl font-bold mb-1">
                {bookings.filter(b => b.status === 'approved').length}
              </div>
              <div className="text-gray-600">Reservas aprovadas</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;