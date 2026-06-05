import React, { useState, useEffect } from 'react';
import { bookingService, authService } from '../services/api';
import { Ticket, Calendar, Clock, MapPin, User, CheckCircle, XCircle, ChevronRight, Mail, Phone } from 'lucide-react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          bookingService.getBookings(),
          authService.getProfile()
        ]);
        setBookings(bookingsRes.data.results || bookingsRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
    </div>
  );

  const isAdmin = profile?.role === 1 || profile?.role === 2;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[40px] shadow-xl shadow-gray-100 border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            <Ticket className="w-10 h-10 text-indigo-600" />
            {isAdmin ? 'System Bookings' : 'My Booking History'}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {isAdmin ? `Monitoring ${bookings.length} total client bookings.` : `Reviewing your ${bookings.length} personal event bookings.`}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Information</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Details</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Date</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                        {booking.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-black text-gray-900">{booking.customer_name}</div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                            <Mail className="w-3 h-3" /> {booking.customer_email}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                            <Phone className="w-3 h-3" /> {booking.customer_phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-gray-900">{booking.event_title}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Ref: #EVT-{booking.id}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-600">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-center">
                    <div className="inline-block px-4 py-1.5 bg-gray-100 rounded-xl text-xs font-black text-gray-700">
                      {booking.quantity} Tickets
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3" /> :
                       booking.status === 'cancelled' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-xl font-black text-indigo-600">${booking.total_price}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center py-32">
              <Ticket className="w-20 h-20 text-gray-100 mx-auto mb-6" />
              <h3 className="text-xl font-black text-gray-900">No Booking History</h3>
              <p className="text-gray-400 font-medium">Any bookings made will appear here instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
