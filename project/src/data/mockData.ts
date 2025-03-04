import { User, Room, Booking } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@desenvolver.com',
    isAdmin: true,
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    isAdmin: false,
  },
];

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Sala Inovação',
    capacity: 8,
    description: 'Sala de reunião equipada com projetor e quadro branco, ideal para brainstorming e apresentações.',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '2',
    name: 'Sala Criatividade',
    capacity: 4,
    description: 'Espaço aconchegante para pequenas reuniões e trabalho em equipe.',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '3',
    name: 'Sala Colaboração',
    capacity: 12,
    description: 'Amplo espaço para workshops e eventos, com configuração flexível de mesas.',
    imageUrl: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '4',
    name: 'Sala Foco',
    capacity: 2,
    description: 'Sala privativa para reuniões confidenciais ou trabalho que exige concentração.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
];

// Generate some sample bookings for the next 7 days
const generateBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const now = new Date();
  
  for (let i = 0; i < 10; i++) {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + Math.floor(Math.random() * 7));
    startDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1 + Math.floor(Math.random() * 3));
    
    const roomId = String(Math.floor(Math.random() * 4) + 1);
    const userId = Math.random() > 0.5 ? '1' : '2';
    const userName = userId === '1' ? 'Admin User' : 'Regular User';
    
    bookings.push({
      id: String(i + 1),
      roomId,
      userId,
      userName,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      status: Math.random() > 0.3 ? 'approved' : 'pending',
      createdAt: new Date(startDate.getTime() - 86400000 * Math.floor(Math.random() * 5)).toISOString(),
    });
  }
  
  return bookings;
};

export const bookings: Booking[] = generateBookings();