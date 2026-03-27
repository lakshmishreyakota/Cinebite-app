import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import AuthContext from '../context/AuthContext';
import { Star, MapPin, ShoppingBag, Plus, Minus, ChevronLeft, ShoppingCart, CheckCircle2 } from 'lucide-react';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCartStatus, setShowCartStatus] = useState(false);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [resRes, foodRes] = await Promise.all([
          API.get(`/restaurants/${id}`),
          API.get(`/food/restaurant/${id}`)
        ]);
        setRestaurant(resRes.data);
        setFoodItems(foodRes.data);
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  const addToCart = (item) => {
    const exist = cart.find(x => x._id === item._id);
    if (exist) {
      setCart(cart.map(x => x._id === item._id ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    setShowCartStatus(true);
    setTimeout(() => setShowCartStatus(false), 2000);
  };

  const removeFromCart = (item) => {
    const exist = cart.find(x => x._id === item._id);
    if (exist.qty === 1) {
      setCart(cart.filter(x => x._id !== item._id));
    } else {
      setCart(cart.map(x => x._id === item._id ? { ...exist, qty: exist.qty - 1 } : x));
    }
  };

  const getQuantity = (id) => {
    const item = cart.find(x => x._id === id);
    return item ? item.qty : 0;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!restaurant) return <div className="text-center py-20 text-gray-500">Restaurant not found.</div>;

  return (
    <div className="animate-fade-in pb-24">
      {/* Restaurant Banner */}
      <div className="relative h-80 w-full mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl glass border border-white/20 transform transition-all hover:scale-[1.005]">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-12">
          <Link to="/restaurants" className="absolute top-6 left-12 p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white text-white hover:text-red-600 transition-all border border-white/30 group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-600 text-white text-[10px] uppercase font-black px-3 py-1 rounded-lg tracking-wider shadow-lg shadow-red-600/30">
                  {restaurant.isTheatreRestuarant ? 'Cinema Dining Enabled' : 'Restaurant'}
                </span>
                <div className="bg-white/90 backdrop-blur-md text-gray-900 border border-white/30 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  {restaurant.rating || '4.5'}
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase leading-none drop-shadow-2xl">{restaurant.name}</h1>
              <div className="flex items-center text-gray-300 gap-6 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-red-500" />
                  {restaurant.location}
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span>{restaurant.numReviews || '120'} Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Menu Items */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-8 border-b-4 border-red-600 inline-block px-1">FEATURED MENU</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {foodItems.map((item) => (
                <div 
                  key={item._id} 
                  className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex gap-6 hover:-translate-y-1"
                >
                  <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-red-500/10 transition-shadow">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="text-lg font-black text-gray-900 mb-1 group-hover:text-red-600 transition-colors tracking-tight">{item.name}</h4>
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
                      <span className="text-xl font-black text-gray-900 tracking-tighter">₹{item.price}</span>
                      {getQuantity(item._id) > 0 ? (
                        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-red-100">
                          <button 
                            onClick={() => removeFromCart(item)}
                            className="bg-gray-100 text-gray-600 p-1 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all border border-transparent active:scale-95"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold text-lg text-gray-800 w-4 text-center">{getQuantity(item._id)}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-red-600 text-white p-1 rounded-lg hover:bg-red-700 shadow-md shadow-red-600/20 active:scale-95 transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-red-600 text-white px-6 py-2 rounded-2xl font-black text-sm hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 group/btn"
                        >
                          <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Cart Panel (Hidden on small screens, sidebar on large) */}
        <div className="hidden lg:block relative">
          <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 shadow-red-900/5">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <ShoppingBag className="text-red-600" />
              YOUR CART
            </h3>
            
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                <ShoppingCart size={48} className="text-gray-200 mx-auto mb-6" />
                <p className="text-gray-400 font-bold mb-2">Cart is empty</p>
                <p className="text-gray-400 text-xs">Add some delicious snacks to get started!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="max-h-[30vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-400 font-medium">₹{item.price} x {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-black text-gray-900 tracking-tighter">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t-2 border-dashed border-gray-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Subtotal</span>
                    <span className="font-bold text-gray-900">₹{cart.reduce((a, c) => a + c.price * c.qty, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-black text-gray-900">
                    <span>TOTAL</span>
                    <span className="text-red-600">₹{cart.reduce((a, c) => a + c.price * c.qty, 0)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  state={{ cart, restaurant }}
                  className="w-full bg-red-600 text-white font-black py-5 px-8 rounded-2xl hover:bg-red-700 active:scale-[0.98] transition-all shadow-xl shadow-red-600/30 flex justify-center items-center gap-3 mt-6 group/checkout"
                >
                  PROCEED TO CHECKOUT
                  <ChevronLeft className="rotate-180 group-hover/checkout:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Status Notification */}
      {showCartStatus && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md animate-fade-in animate-bounce-slow">
          <CheckCircle2 className="text-green-500" />
          <span className="font-black text-sm tracking-tight">Added to your CineBite cart!</span>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
