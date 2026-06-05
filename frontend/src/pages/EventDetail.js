import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, bookingService, authService } from '../services/api';
import { Calendar, MapPin, Users, Ticket, ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, profileRes] = await Promise.all([
          eventService.getEvent(id),
          authService.getProfile()
        ]);
        setEvent(eventRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error("Error fetching event details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getDefaultImage = (categoryName) => {
    const category = categoryName?.toLowerCase() || '';
    if (category.includes('tech')) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200';
    if (category.includes('birth')) return 'https://images.unsplash.com/photo-1530103043236-02d1f1721831?auto=format&fit=crop&q=80&w=1200';
    if (category.includes('concert') || category.includes('music')) return 'https://images.unsplash.com/photo-1459749411172-5df5745738b8?auto=format&fit=crop&q=80&w=1200';
    if (category.includes('party')) return 'https://images.unsplash.com/photo-1492683962456-d49d41fe0843?auto=format&fit=crop&q=80&w=1200';
    if (category.includes('indus') || category.includes('business')) return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200';
    return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200';
  };

  const handleBooking = async () => {
    if (quantity > event.available_seats) {
      alert("Not enough seats available!");
      return;
    }

    setBookingLoading(true);
    try {
      await bookingService.createBooking({
        event: id,
        quantity: quantity,
      });
      navigate('/bookings');
    } catch (error) {
      alert('Booking failed. Please check your details.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!event) return <div className="text-center py-20">Event not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-bold transition">
        <ChevronLeft className="w-5 h-5" /> Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src={event.banner || getDefaultImage(event.category_name)}
              alt={event.title}
              className="w-full h-full object-cover transition transform duration-500 group-hover:scale-105"
              onError={(e) => { e.target.src = getDefaultImage(event.category_name) }}
            />
            <div className="absolute top-6 left-6">
              <span className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                {event.category_name}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black text-gray-900 leading-tight">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-gray-500">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold">{new Date(event.start_date).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold">{event.venue_details}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>

        {/* Sidebar Booking Card */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Price per ticket</p>
                <p className="text-3xl font-black text-gray-900">₹{parseFloat(event.price).toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Available</p>
                <p className="text-lg font-bold text-blue-600">{event.available_seats} / {event.capacity}</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Select Tickets</label>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="flex-grow text-center font-black text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(event.available_seats, quantity + 1))}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 font-bold">Total Price</span>
                  <span className="font-black text-blue-900">₹{(event.price * quantity).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-blue-400 uppercase font-black tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Secure Payment
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading || event.available_seats <= 0}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
              >
                {bookingLoading ? 'Processing...' : event.available_seats > 0 ? 'Confirm Booking' : 'Sold Out'}
              </button>

              {event.available_seats < 10 && event.available_seats > 0 && (
                <p className="flex items-center justify-center gap-2 text-orange-600 text-xs font-bold animate-pulse">
                  <AlertCircle className="w-3 h-3" /> Hurry! Only {event.available_seats} tickets left.
                </p>
              )}
            </div>

            <div className="pt-6 border-t">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Event Manager</h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                  {event.manager_name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-gray-700">{event.manager_name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
