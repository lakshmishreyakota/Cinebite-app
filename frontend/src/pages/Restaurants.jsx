import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import { Star, MapPin, Search, Filter } from 'lucide-react';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await API.get('/restaurants');
        setRestaurants(data);
      } catch (err) {
        setError('Failed to fetch restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Explore Restaurants</h1>
          <p className="text-gray-500">Discover the best food near you or inside your theatre.</p>
        </div>

        <div className="relative max-w-md w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 shadow-sm transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <Link 
            key={restaurant._id} 
            to={`/restaurant/${restaurant._id}`}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-2"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-gray-800">{restaurant.rating || 'New'}</span>
              </div>
              {restaurant.isTheatreRestuarant && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-red-600/20">
                  Theatre Mode Available
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">{restaurant.name}</h3>
                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{restaurant.category}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{restaurant.description}</p>
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-gray-400 text-xs font-medium">
                <MapPin size={14} className="mr-1" />
                {restaurant.location}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No restaurants found</h3>
          <p className="text-gray-500">Try adjusting your search or category.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
