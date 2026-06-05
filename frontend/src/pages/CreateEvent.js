import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, api } from '../services/api';
import { PlusCircle, Image as ImageIcon, Calendar, MapPin, DollarSign, Users, Tag, Upload } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    capacity: '',
    price: '',
    start_date: '',
    end_date: '',
    venue_details: '',
  });
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('events/categories/');
        setCategories(res.data.results || res.data);
      } catch (error) {
        setCategories([{ id: 1, name: 'Birthday' }, { id: 2, name: 'Concert' }, { id: 3, name: 'Party' }, { id: 4, name: 'Industry' }]);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (banner) {
      data.append('banner', banner);
    }

    try {
      // Use axios directly for multipart/form-data or update eventService
      await api.post('events/events/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/events');
    } catch (error) {
      alert('Failed to create event. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-50">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
          <div className="bg-[#0A261E] p-3 rounded-2xl">
            <PlusCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#0A261E]">Add New Event</h1>
            <p className="text-gray-500 font-medium">Capture every detail, including a stunning banner image.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Banner Image</label>
            <div className="relative group">
              <div className={`w-full h-80 rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-gray-50 ${preview ? 'border-solid border-indigo-600' : 'border-gray-200 hover:border-indigo-400'}`}>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="bg-white p-4 rounded-full shadow-sm inline-block">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 font-bold">Drag and drop or click to upload banner</p>
                    <p className="text-xs text-gray-300">Recommended size: 1200 x 600px</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {preview && (
                <button
                  type="button"
                  onClick={() => {setPreview(null); setBanner(null);}}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Tech Summit"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition font-bold"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <select
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition font-bold appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition font-bold"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Description</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition font-bold resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition font-bold"
                    value={formData.venue_details}
                    onChange={(e) => setFormData({ ...formData, venue_details: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition font-bold"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Capacity</label>
                <input
                  type="number"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition font-bold"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
          </div>

          <div className="flex justify-end gap-4 pt-10">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-10 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0A261E] text-white px-12 py-4 rounded-2xl font-black hover:bg-black transition shadow-xl disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
