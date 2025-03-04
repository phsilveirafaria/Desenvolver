import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Room } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface BookingContextType {
  bookings: Booking[];
  rooms: Room[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateBookingStatus: (id: string, status: 'approved' | 'rejected') => Promise<boolean>;
  deleteBooking: (id: string) => Promise<boolean>;
  getBookingsByRoom: (roomId: string) => Booking[];
  getRoom: (roomId: string) => Room | undefined;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser, isAuthenticated } = useAuth();

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedRooms: Room[] = data.map(room => ({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          description: room.description,
          imageUrl: room.image_url
        }));
        
        setRooms(formattedRooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      if (!isAuthenticated) {
        setBookings([]);
        return;
      }
      
      let query = supabase
        .from('bookings')
        .select('*')
        .order('start_time');
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedBookings: Booking[] = data.map(booking => ({
          id: booking.id,
          roomId: booking.room_id,
          userId: booking.user_id,
          userName: booking.user_name,
          startTime: booking.start_time,
          endTime: booking.end_time,
          status: booking.status as 'pending' | 'approved' | 'rejected',
          createdAt: booking.created_at,
          notes: booking.notes
        }));
        
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await Promise.all([fetchRooms(), fetchBookings()]);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [isAuthenticated]);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    try {
      if (!currentUser) return false;
      
      const { error } = await supabase
        .from('bookings')
        .insert({
          room_id: bookingData.roomId,
          user_id: currentUser.id,
          user_name: currentUser.name,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          notes: bookingData.notes
        });
      
      if (error) {
        throw error;
      }
      
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Error adding booking:', error);
      return false;
    }
  };

  const updateBookingStatus = async (id: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  };

  const deleteBooking = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  };

  const getBookingsByRoom = (roomId: string) => {
    return bookings.filter(booking => booking.roomId === roomId);
  };

  const getRoom = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  return (
    <BookingContext.Provider 
      value={{ 
        bookings, 
        rooms, 
        addBooking, 
        updateBookingStatus, 
        deleteBooking, 
        getBookingsByRoom,
        getRoom,
        isLoading,
        refreshData
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};