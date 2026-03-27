import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import API from '../api/api';
import { CreditCard, MapPin, Ticket, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const { cart, restaurant } = location.state || { cart: [], restaurant: null };

  const [deliveryType, setDeliveryType] = useState('home');
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState('');
  const [screen, setScreen] = useState('');
  const [seat, setSeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = cart.reduce((a, c) => a + c.price * c.qty, 0);

  useEffect(() => {
    if (!userInfo) navigate('/login');
    if (!cart.length) navigate('/restaurants');

    const fetchTheatres = async () => {
      // For now, if restaurant is theatre-enabled, show that theatre
      if (restaurant?.isTheatreRestuarant && restaurant.theatreId) {
        try {
          const { data } = await API.get('/restaurants'); // In a real app, I'd have a /theatres route
          // Mocking theatre list for now based on seeded PVR IMAX
          setTheatres([{ _id: '1', name: 'PVR IMAX', location: 'Forum Mall' }]);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchTheatres();
  }, [userInfo, cart, navigate, restaurant]);

  const handlePlaceOrder = async () => {
    if (deliveryType === 'theatre-seat' && (!selectedTheatre || !screen || !seat)) {
      setError('Please provide theatre, screen, and seat number.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({
          foodItem: item._id,
          quantity: item.qty,
          price: item.price
        })),
        restaurantId: restaurant._id,
        totalPrice,
        deliveryType,
        theatreSeat: deliveryType === 'theatre-seat' ? {
          theatreId: restaurant.theatreId || '65e...mock', // Use real ID if available
          screen,
          seatNumber: seat
        } : null
      };

      const { data } = await API.post('/orders', orderData);
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <h1 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter uppercase border-b-8 border-red-600 inline-block">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Delivery Details */}
        <div className="space-y-12">
          {/* 1. Delivery Type Selection */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              DELIVERY MODE
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setDeliveryType('home')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${deliveryType === 'home' ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
              >
                <div className={`p-3 rounded-xl ${deliveryType === 'home' ? 'bg-red-600 text-white' : 'bg-white text-gray-400'}`}>
                  <MapPin size={24} />
                </div>
                <span className={`font-bold ${deliveryType === 'home' ? 'text-red-600' : 'text-gray-400'}`}>Home Delivery</span>
              </button>
              <button 
                onClick={() => setDeliveryType('theatre-seat')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${deliveryType === 'theatre-seat' ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
              >
                <div className={`p-3 rounded-xl ${deliveryType === 'theatre-seat' ? 'bg-red-600 text-white' : 'bg-white text-gray-400'}`}>
                  <Ticket size={24} />
                </div>
                <span className={`font-bold ${deliveryType === 'theatre-seat' ? 'text-red-600' : 'text-gray-400'}`}>Theatre Seat</span>
              </button>
            </div>
          </div>

          {/* 2. Mode Specific Address */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 animate-slide-up">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
              {deliveryType === 'home' ? 'SHIPPING ADDRESS' : 'THEATRE DETAILS'}
            </h3>
            
            {deliveryType === 'home' ? (
              <div className="space-y-4">
                <textarea 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none transition-all placeholder:text-gray-300"
                  placeholder="Enter your full home address..."
                  rows="3"
                ></textarea>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
                  <input type="text" placeholder="Pincode" className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 ml-2 uppercase tracking-widest">Select Theatre</label>
                  <select 
                    value={selectedTheatre} 
                    onChange={(e) => setSelectedTheatre(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none appearance-none font-bold"
                  >
                    <option value="">Choose Cinema</option>
                    <option value="pvr-imax">PVR IMAX - Forum Mall</option>
                    <option value="inox-lid-mall">INOX - LID Mall</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 ml-2 uppercase tracking-widest">Screen No.</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Screen 4"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-red-600 transition-colors"
                      value={screen}
                      onChange={(e) => setScreen(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 ml-2 uppercase tracking-widest">Seat Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. G-12"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-red-600 transition-colors"
                      value={seat}
                      onChange={(e) => setSeat(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 flex gap-3 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>Our staff will deliver the order silently during the movie to your seat.</p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Mock */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
              PAYMENT
            </h3>
            <div className="p-6 border-2 border-red-600 bg-red-50 rounded-2xl flex items-center justify-between group cursor-pointer active:scale-[0.99] transition-all">
              <div className="flex items-center gap-4">
                <CreditCard className="text-red-600" />
                <div>
                  <p className="font-bold text-gray-900">COD / Pay at Theatre</p>
                  <p className="text-xs text-gray-500 font-medium">Safe & secure checkout</p>
                </div>
              </div>
              <CheckCircle2 className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="sticky top-28 bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl border border-white/10 shadow-red-900/40">
            <h3 className="text-2xl font-black mb-8 tracking-tighter uppercase">ORDER SUMMARY</h3>
            
            <div className="space-y-6 mb-10 pb-8 border-b border-white/10 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-xs group-hover:bg-red-600 transition-colors">{item.qty}x</span>
                    <p className="font-bold text-white group-hover:text-red-400 transition-colors">{item.name}</p>
                  </div>
                  <span className="font-black tracking-tighter">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-gray-400 font-bold uppercase text-xs tracking-widest">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-bold uppercase text-xs tracking-widest">
                <span>GST & Taxes</span>
                <span>₹{(totalPrice * 0.18).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-3xl font-black text-white pt-6 border-t border-white/10">
                <span>TOTAL</span>
                <span className="text-red-500">₹{(totalPrice * 1.18).toFixed(0)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-6 text-sm border border-red-500/20 animate-shake">
                {error}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-red-600 text-white font-black py-6 rounded-[2rem] hover:bg-red-700 active:scale-[0.98] transition-all shadow-xl shadow-red-600/30 flex justify-center items-center gap-4 group"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  PLACE ORDER NOW
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-white/40 text-[10px] mt-6 leading-relaxed font-bold tracking-widest">
              BY CLICKING THIS BUTTON YOU AGREE TO OUR TERMS AND CONDITIONS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
