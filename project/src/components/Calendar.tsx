import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Booking, Room } from '../types';
import { useBooking } from '../context/BookingContext';
import { Clock } from 'lucide-react';

interface CalendarProps {
  room: Room;
}

const Calendar: React.FC<CalendarProps> = ({ room }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getBookingsByRoom } = useBooking();
  
  const bookings = getBookingsByRoom(room.id);
  
  // Generate the days of the week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Generate time slots from 8:00 to 22:00
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 8;
    return `${hour}:00`;
  });
  
  const isBookingInTimeSlot = (booking: Booking, day: Date, timeSlot: string) => {
    try {
      const [hour] = timeSlot.split(':').map(Number);
      
      const slotStart = new Date(day);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(day);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      const bookingStart = parseISO(booking.startTime);
      const bookingEnd = parseISO(booking.endTime);
      
      return isWithinInterval(slotStart, { start: bookingStart, end: bookingEnd }) ||
             isWithinInterval(bookingEnd, { start: slotStart, end: slotEnd }) ||
             (bookingStart <= slotStart && bookingEnd >= slotEnd);
    } catch (error) {
      console.error('Error checking booking time slot:', error);
      return false;
    }
  };
  
  const getBookingsForSlot = (day: Date, timeSlot: string) => {
    return bookings.filter(booking => {
      try {
        const bookingDate = parseISO(booking.startTime);
        return isSameDay(bookingDate, day) && isBookingInTimeSlot(booking, day, timeSlot);
      } catch (error) {
        console.error('Error getting bookings for slot:', error);
        return false;
      }
    });
  };
  
  const handlePreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
        <button 
          onClick={handlePreviousWeek}
          className="px-3 py-1 bg-white rounded border hover:bg-gray-50"
        >
          &larr; Anterior
        </button>
        
        <h3 className="text-lg font-semibold text-blue-800">
          {format(weekDays[0], "dd 'de' MMMM", { locale: ptBR })} - {format(weekDays[6], "dd 'de' MMMM", { locale: ptBR })}
        </h3>
        
        <button 
          onClick={handleNextWeek}
          className="px-3 py-1 bg-white rounded border hover:bg-gray-50"
        >
          Próxima &rarr;
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b border-r bg-gray-50 w-20"></th>
              {weekDays.map(day => (
                <th key={day.toString()} className="p-2 border-b text-center min-w-[120px]">
                  <div className="font-medium">{format(day, 'EEEE', { locale: ptBR })}</div>
                  <div className="text-sm text-gray-500">{format(day, 'dd/MM')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot}>
                <td className="p-2 border-r text-center bg-gray-50">
                  <div className="flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{timeSlot}</span>
                  </div>
                </td>
                {weekDays.map(day => {
                  const slotBookings = getBookingsForSlot(day, timeSlot);
                  const hasBooking = slotBookings.length > 0;
                  const booking = slotBookings[0]; // Just show the first booking if multiple
                  
                  return (
                    <td 
                      key={`${day}-${timeSlot}`} 
                      className="p-1 border border-gray-200 h-16"
                    >
                      {hasBooking ? (
                        <div 
                          className={`
                            h-full p-1 rounded text-sm
                            ${booking.status === 'approved' ? 'bg-green-100' : 
                              booking.status === 'rejected' ? 'bg-red-100' : 
                              'bg-yellow-100'}
                          `}
                        >
                          <div className="font-medium truncate">{booking.userName}</div>
                          <div className="text-xs text-gray-600">
                            {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                          </div>
                          <div className="text-xs mt-1">
                            {booking.status === 'approved' ? '✓ Aprovado' : 
                             booking.status === 'rejected' ? '✗ Rejeitado' : 
                             '⏳ Pendente'}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <span className="text-sm text-gray-400">Disponível</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;