export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  description: string;
  imageUrl: string;
};

export type Booking = {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  notes?: string;
};