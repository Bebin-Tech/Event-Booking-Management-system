import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import BookingHistory from './pages/BookingHistory';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Placeholder for new Admin pages
const CustomerManagement = () => <div className="p-8"><h1 className="text-2xl font-bold">Customer Management</h1><p className="text-gray-500">List of all registered customers will appear here.</p></div>;
const AdminReports = () => <div className="p-8"><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-gray-500">Revenue and booking reports will appear here.</p></div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/bookings" element={<BookingHistory />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin specific routes */}
              <Route path="/admin/customers" element={<CustomerManagement />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
