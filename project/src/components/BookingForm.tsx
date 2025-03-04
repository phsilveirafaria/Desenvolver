import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addHours } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { Room } from '../types';

const bookingSchema = z.object({
  startTime: z.string().min(1, 'Horário de início é obrigatório'),
  endTime: z.string().min(1, 'Horário de término é obrigatório'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  room: Room;
  initialDate?: Date;
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  room, 
  initialDate = new Date(), 
  onSubmit, 
  onCancel 
}) => {
  const { currentUser } = useAuth();
  
  // Set default start time to the initialDate and end time to 1 hour later
  const defaultStartTime = format(initialDate, "yyyy-MM-dd'T'HH:mm");
  const defaultEndTime = format(addHours(initialDate, 1), "yyyy-MM-dd'T'HH:mm");
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      notes: '',
    },
  });
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reservar {room.name}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Usuário</label>
          <input
            type="text"
            value={currentUser?.name || ''}
            disabled
            className="w-full px-3 py-2 border rounded-md bg-gray-50"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Horário de início</label>
          <input
            type="datetime-local"
            {...register('startTime')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Horário de término</label>
          <input
            type="datetime-local"
            {...register('endTime')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Observações (opcional)</label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : 'Reservar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;