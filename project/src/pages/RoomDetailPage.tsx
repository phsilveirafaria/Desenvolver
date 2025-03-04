import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Calendar from '../components/Calendar';
import BookingForm from '../components/BookingForm';
import BookingDetails from '../components/BookingDetails';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import { Users, MapPin } from 'lucide-react';

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoom, addBooking, updateBookingStatus, deleteBooking } = useBooking();
  const { currentUser } = useAuth();
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
  
  const room = getRoom(id || '');
  
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
  
  const handleAddBookingClick = (date: Date) => {
    setInitialDate(date);
    setShowBookingForm(true);
    setSelectedBooking(null);
  };
  
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingForm(false);
  };
  
  const handleBookingSubmit = (data: any) => {
    if (!currentUser) return;
    
    addBooking({
      roomId: room.id,
      userId: currentUser.id,
      userName: currentUser.name,
      startTime: data.startTime,
      endTime: data.endTime,
    });
    
    setShowBookingForm(false);
  };
  
  const handleApproveBooking = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, 'approved');
      setSelectedBooking(null);
    }
  };
  
  const handleRejectBooking = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, 'rejected');
      setSelectedBooking(null);
    }
  };
  
  const handleDeleteBooking = () => {
    if (selectedBooking) {
      deleteBooking(selectedBooking.id);
      setSelectedBooking(null);
    }
  };
  
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
              
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Reservar esta sala
              </button>
            </div>
          </div>
        </div>
        
        {showBookingForm ? (
          <BookingForm 
            room={room}
            initialDate={initialDate}
            onSubmit={handleBookingSubmit}
            onCancel={() => setShowBookingForm(false)}
          />
        ) : selectedBooking ? (
          <BookingDetails 
            booking={selectedBooking}
            room={room}
            onClose={() => setSelectedBooking(null)}
            onApprove={handleApproveBooking}
            onReject={handleRejectBooking}
            onDelete={handleDeleteBooking}
          />
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Disponibilidade</h2>
            <Calendar 
              room={room}
              onBookingClick={handleBookingClick}
              onAddBooking={handleAddBookingClick}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RoomDetailPage;