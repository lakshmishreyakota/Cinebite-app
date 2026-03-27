import { useState, useEffect, useContext } from 'react';
import API from '../api/api';
import AuthContext from '../context/AuthContext';
import { Package, Clock, CheckCircle, Truck, RefreshCcw, LayoutDashboard, ChevronRight } from 'lucide-react';

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders'); // In real app, /orders/vendor
      setOrders(data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Polling as fallback for sockets
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const stats = [
    { label: 'Active', count: orders.filter(o => o.status !== 'delivered').length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', count: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Earnings', count: `₹${orders.reduce((a, c) => a + c.totalAmount, 0)}`, icon: RefreshCcw, color: 'text-red-600', bg: 'bg-red-50' }
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Vendor Dashboard</h1>
          <p className="text-gray-500 font-bold">Manage your incoming orders and status updates.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-red-600"
        >
          <RefreshCcw size={24} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${stat.bg} p-8 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-900/5 flex items-center justify-between group transform hover:-translate-y-2 transition-all duration-300`}>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.count}</p>
              </div>
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Icon size={28} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="text-red-600" />
            RECENT ORDERS
          </h3>
          <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Live Updates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-8 text-xs font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                <th className="p-8 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="p-8 text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="p-8 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-8 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-8">
                    <div className="space-y-1">
                      <p className="font-black text-gray-900 tracking-tight">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 font-bold">{order.items.length} Items</p>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.deliveryType === 'home' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {order.deliveryType === 'home' ? (
                        <span className="flex items-center gap-2 underline underline-offset-4 decoration-2 decoration-blue-200">HOME DELIVERY</span>
                      ) : (
                        <span className="flex items-center gap-2 underline underline-offset-4 decoration-2 decoration-red-200">SEAT: {order.theatreSeat.screen} {order.theatreSeat.seatNumber}</span>
                      )}
                    </span>
                  </td>
                  <td className="p-8">
                    <p className="text-xl font-black text-gray-900 tracking-tighter">₹{order.totalAmount}</p>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {order.status === 'placed' && (
                        <button 
                          onClick={() => updateStatus(order._id, 'preparing')}
                          className="px-4 py-2 bg-blue-600 text-white transform hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20"
                        >
                          Prepare
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => updateStatus(order._id, 'out-for-delivery')}
                          className="px-4 py-2 bg-yellow-600 text-white transform hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-yellow-600/20"
                        >
                          Send Out
                        </button>
                      )}
                      {order.status === 'out-for-delivery' && (
                        <button 
                          onClick={() => updateStatus(order._id, 'delivered')}
                          className="px-4 py-2 bg-green-600 text-white transform hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-600/20 flex items-center gap-2"
                        >
                          <CheckCircle size={14} />
                          Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
