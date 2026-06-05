import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, LogOut, LayoutDashboard, Ticket, PlusSquare, Menu, X, Users, BarChart3, Search } from 'lucide-react';
import { authService } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (token) {
      authService.getProfile().then(res => setProfile(res.data)).catch(() => handleLogout());
    }
  }, [token, location]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setProfile(null);
    navigate('/login');
  };

  if (!token) return null;

  const isAdmin = profile?.role === 1 || profile?.role === 2;

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition text-sm font-black tracking-tight ${
          isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="w-4 h-4" /> {children}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-12">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-[16px] shadow-lg shadow-indigo-100">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">EVENT<span className="text-indigo-600">BOOK</span></span>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/events" icon={Search}>Explore Events</NavLink>
              {isAdmin && <NavLink to="/create-event" icon={PlusSquare}>Add Event</NavLink>}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="h-10 w-px bg-gray-100 mx-2"></div>
            <Link to="/profile" className="flex items-center gap-4 group">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition">
                  {profile?.first_name || profile?.username}
                </p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
                  {isAdmin ? 'Administrator' : 'Verified Client'}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-transparent group-hover:border-indigo-600 transition overflow-hidden shadow-inner">
                {profile?.profile_photo ? (
                  <img src={profile.profile_photo} alt="P" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-3.5 text-gray-400 hover:text-red-600 transition rounded-2xl hover:bg-red-50 bg-gray-50"
              title="Secure Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-3 text-gray-600 bg-gray-50 rounded-2xl">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden py-8 border-t border-gray-50 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard Overview</NavLink>
            <NavLink to="/events" icon={Search}>Explore Events</NavLink>
            {isAdmin && <NavLink to="/create-event" icon={PlusSquare}>Add New Event</NavLink>}
            <NavLink to="/profile" icon={User}>Profile Settings</NavLink>
            <div className="pt-8 mt-8 border-t border-gray-50 px-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-red-600 font-black py-5 bg-red-50 rounded-[24px] justify-center shadow-inner"
              >
                <LogOut className="w-5 h-5" /> SECURE LOGOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
