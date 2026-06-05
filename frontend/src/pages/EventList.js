import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (search = '') => {
    try {
      setLoading(true);
      const response = await eventService.getEvents({ search });
      setEvents(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents(searchTerm);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDefaultImage = (categoryName) => {
    const category = categoryName?.toLowerCase() || '';
    if (category.includes('tech')) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800';
    if (category.includes('birth')) return 'https://images.unsplash.com/photo-1530103043236-02d1f1721831?auto=format&fit=crop&q=80&w=800';
    if (category.includes('concert') || category.includes('music')) return 'https://images.unsplash.com/photo-1459749411172-5df5745738b8?auto=format&fit=crop&q=80&w=800';
    if (category.includes('party')) return 'https://images.unsplash.com/photo-1492683962456-d49d41fe0843?auto=format&fit=crop&q=80&w=800';
    if (category.includes('indus') || category.includes('business')) return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800'; // Default general event
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-[42px] font-bold text-[#0A261E] mb-8">Discover events</h1>

        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-600 transition" />
            <input
              type="text"
              placeholder="Search events, locations, or categories..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition font-medium shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#0A261E] text-white px-8 rounded-xl font-bold hover:bg-black transition">
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A261E]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
            >
              {/* Image Header */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.banner || getDefaultImage(event.category_name)}
                  alt={event.title}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.src = getDefaultImage(event.category_name) }}
                />

                {/* Location Badge Overlay */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-bold border border-white/20">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.venue_details.split(',')[0]}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-[#0A261E] mb-6 leading-tight min-h-[56px] line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="text-xl font-black text-gray-900">
                    ₹{parseFloat(event.price).toLocaleString('en-IN')}.00
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium text-gray-600">
                      {formatDate(event.start_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Clock className="w-4 h-4" />
                      8h
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full bg-[#0A261E] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-100 flex items-center justify-center gap-2"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
          <h2 className="text-2xl font-bold text-gray-400">No events found</h2>
          <p className="text-gray-500 mt-2">Try searching for something else.</p>
        </div>
      )}

      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSuccess={() => {
            setSelectedEvent(null);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};

export default EventList;
