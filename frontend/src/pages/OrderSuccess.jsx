import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import io from 'socket.io-client';
import { CheckCircle2, Package, Search, Truck, MapPin, Ticket, ChevronRight, Bell } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('placed');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Socket.IO Setup
    const socket = io('http://localhost:5000');
    socket.emit('join-room', id);

    socket.on('order-status-update', (newStatus) => {
      setStatus(newStatus);
    });

    return () => socket.disconnect();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return <div className="text-center py-20 text-gray-500">Order not found.</div>;

  const steps = [
    { key: 'placed', label: 'Order Placed', icon: Search },
    { key: 'preparing', label: 'Preparing', icon: Package },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  const currentStep = steps.findIndex(s => s.key === status);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      {/* 1. Success Message */}
      <div className="text-center mb-16 py-12 px-6 bg-green-50 rounded-[3rem] border border-green-100 flex flex-col items-center shadow-xl shadow-green-900/5 overflow-hidden relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce-slow border-4 border-green-200">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Order Confirmed!</h1>
        <p className="text-gray-600 font-bold max-w-md mx-auto leading-relaxed">
          Yay! Your meal from <span className="text-green-600">{order.restaurant.name}</span> is being prepared. Grab your popcorn, the show is starting soon!
        </p>
        <div className="mt-8 px-6 py-2 bg-white rounded-full font-black text-sm text-gray-400 tracking-widest border border-green-200">
          ORDER ID: #{order._id.slice(-6).toUpperCase()}
        </div>
      </div>

      {/* 2. Track Order */}
      <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100 mb-12">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <Bell size={24} className="text-red-600" />
            LIVE TRACKING
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs font-black text-green-600 uppercase tracking-widest">Real-time update</span>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="relative flex justify-between items-start mb-20 max-w-2xl mx-auto">
          {/* Progress Bar Background */}
          <div className="absolute top-7 left-0 w-full h-1.5 bg-gray-100 rounded-full -z-0"></div>
          {/* Filled Progress Bar */}
          <div 
            className="absolute top-7 left-0 h-1.5 bg-red-600 rounded-full -z-0 transition-all duration-700"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isCompleted ? 'bg-red-600 text-white shadow-red-600/30' : 'bg-white text-gray-300 border border-gray-100'}`}>
                  <Icon size={24} />
                </div>
                <div className="absolute -bottom-10 whitespace-nowrap text-center">
                  <p className={`text-[10px] uppercase font-black tracking-widest ${isCurrent ? 'text-red-600' : 'text-gray-400 opacity-60'}`}>{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Delivery Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-gray-50 mt-10">
          <div className="flex gap-5 items-start">
            <div className="p-4 bg-gray-50 rounded-2xl text-gray-400">
              {order.deliveryType === 'home' ? <MapPin size={28} /> : <Ticket size={28} />}
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Delivering to</p>
              {order.deliveryType === 'home' ? (
                <p className="font-bold text-gray-900 leading-snug">Home Address, 123 Main St, Bangalore</p>
              ) : (
                <div className="space-y-1">
                  <p className="font-black text-red-600 text-lg tracking-tight">SCREEN {order.theatreSeat.screen} · SEAT {order.theatreSeat.seatNumber}</p>
                  <p className="font-bold text-gray-400 text-xs italic">{order.restaurant.name} Cinema Outlet</p>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Estimated Arrival</p>
              <p className="text-2xl font-black text-gray-900 tracking-tighter">15-20 MINS</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Truck size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/restaurants" className="flex-1 bg-white text-gray-900 font-bold p-5 rounded-2xl border border-gray-200 hover:border-red-600 hover:text-red-600 transition-all text-center flex items-center justify-center gap-2 group">
          Keep Exploring
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link to="/orders" className="flex-1 bg-gray-900 text-white font-bold p-5 rounded-2xl hover:bg-black transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20">
          View Order History
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
