import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, ChevronRight, MapPin, Mail, Phone, User } from 'lucide-react';
import StatCard from '../components/StatCard';
import { eventService, bookingService, authService } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes, profileRes] = await Promise.all([
          eventService.getDashboardStats(),
          bookingService.getBookings(),
          authService.getProfile()
        ]);
        setStats(statsRes.data);
        setBookings(bookingsRes.data.results || bookingsRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
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
  const upcomingBooked = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[40px] shadow-xl shadow-gray-100 border border-gray-50">
        <div className="flex items-center gap-6">
          <div className="bg-indigo-600 p-4 rounded-[24px] shadow-lg shadow-indigo-100">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {isAdmin ? 'Admin Dashboard' : 'Client Dashboard'}
            </h1>
            <p className="text-gray-500 font-medium">Welcome back, {profile?.first_name || profile?.username}!</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[24px]">
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Status</p>
            <p className="text-sm font-black text-green-600 mt-1 uppercase">{isAdmin ? 'Administrator' : 'Verified Client'}</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard title="Total Events" value={stats?.total_events} icon={<Calendar className="text-indigo-500" />} trend="All listings" />
            <StatCard title="Total Customers" value={stats?.total_customers} icon={<Users className="text-green-500" />} trend="Registered" />
            <StatCard title="Total Bookings" value={stats?.total_bookings} icon={<Clock className="text-yellow-500" />} trend="System wide" />
            <StatCard title="Total Revenue" value={`$${stats?.total_revenue?.toLocaleString()}`} icon={<DollarSign className="text-purple-500" />} trend="Confirmed" />
          </>
        ) : (
          <>
            <StatCard title="Total Events Booked" value={bookings.length} icon={<Ticket className="text-indigo-500" />} trend="All time" />
            <StatCard title="Upcoming Booked" value={upcomingBooked} icon={<Calendar className="text-green-500" />} trend="Confirmed events" />
            <StatCard title="Booking History" value={bookings.length} icon={<Clock className="text-yellow-500" />} trend="Past events" />
            <StatCard title="Total Spent" value={`$${stats?.total_spent?.toLocaleString()}`} icon={<DollarSign className="text-purple-500" />} trend="Confirmed" />
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-12">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black text-gray-900">
                {isAdmin ? 'System-wide Booking Details' : 'My Recent Booking Activity'}
              </h2>
              <Link to="/bookings" className="text-indigo-600 font-black text-sm flex items-center gap-2 hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Info</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Name</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Date</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tickets</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.slice(0, 8).map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition duration-300">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-gray-900">{booking.customer_name}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{booking.customer_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{booking.event_title}</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-500">{new Date(booking.booking_date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-gray-700">
                          {booking.quantity} Tickets
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3" /> :
                           booking.status === 'cancelled' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-lg font-black text-indigo-600">${booking.total_price}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center py-20">
                  <Clock className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest">No bookings to display</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Local Ticket Icon component for stats
const Ticket = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);

export default Dashboard;
