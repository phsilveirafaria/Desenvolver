import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Room } from '../types';
import { supabase } from '../lib/supabase';
import { rooms as mockRooms, bookings as mockBookings } from '../data/mockData';

interface BookingContextType {
  bookings: Booking[];
  rooms: Room[];
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

  const fetchRooms = async () => {
    try {
      console.log('Fetching rooms from Supabase...');
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching rooms from Supabase:', error);
        // Fall back to mock data if there's an error
        setRooms(mockRooms);
        return;
      }
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} rooms in Supabase`);
        const formattedRooms: Room[] = data.map(room => ({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          description: room.description,
          imageUrl: room.image_url || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        }));
        
        setRooms(formattedRooms);
      } else {
        console.log('No rooms found in Supabase, using mock data');
        setRooms(mockRooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      // Fall back to mock data on any error
      setRooms(mockRooms);
    }
  };

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings from Supabase...');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('start_time');
      
      if (error) {
        console.error('Error fetching bookings from Supabase:', error);
        // Fall back to mock data if there's an error
        setBookings(mockBookings);
        return;
      }
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} bookings in Supabase`);
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
      } else {
        console.log('No bookings found in Supabase, using mock data');
        setBookings(mockBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fall back to mock data on any error
      setBookings(mockBookings);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchRooms(), fetchBookings()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Set up a subscription for real-time updates
    const roomsSubscription = supabase
      .channel('rooms-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
        console.log('Rooms changed, refreshing data...');
        fetchRooms();
      })
      .subscribe();
      
    const bookingsSubscription = supabase
      .channel('bookings-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        console.log('Bookings changed, refreshing data...');
        fetchBookings();
      })
      .subscribe();
    
    // Clean up subscriptions
    return () => {
      supabase.removeChannel(roomsSubscription);
      supabase.removeChannel(bookingsSubscription);
    };
  }, []);

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