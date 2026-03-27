import { useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import AuthContext from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Restaurants from './pages/Restaurants'
import RestaurantMenu from './pages/RestaurantMenu'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import VendorDashboard from './pages/VendorDashboard'
import { LogOut, User, ShoppingCart, Utensils } from 'lucide-react'

function Header() {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600 flex items-center gap-2">
          <Utensils className="w-8 h-8" />
          CineBite
        </Link>
        <nav className="hidden md:flex gap-8 items-center font-medium">
          <Link to="/" className="text-gray-600 hover:text-red-500 transition-colors">Home</Link>
          <Link to="/restaurants" className="text-gray-600 hover:text-red-500 transition-colors">Restaurants</Link>
          <Link to="/restaurants" className="text-gray-600 hover:text-red-500 transition-colors font-bold text-red-600">Theatre Mode 🍿</Link>
        </nav>
        <div className="flex gap-4 items-center">
          {userInfo ? (
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                <ShoppingCart size={24} />
              </Link>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                <User size={18} className="text-gray-500" />
                <span className="text-sm font-semibold">{userInfo.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-5 py-2 text-gray-700 font-medium hover:text-red-600 transition-colors">Login</Link>
              <Link to="/signup" className="px-5 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all shadow-md shadow-red-600/20">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Header />
        
        <main className="max-w-7xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-24 px-4 bg-gradient-to-b from-red-50 to-transparent rounded-3xl mb-12">
                <h2 className="text-4xl md:text-7xl font-extrabold mb-6 animate-fade-in leading-tight">
                  Food Delivered to Your <br />
                  <span className="text-red-600 bg-white px-4 rounded-2xl shadow-sm border border-red-100">Theatre Seat</span>
                </h2>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                  The ultimate cinema dining experience. Order from top restaurants and get it delivered directly to your exact seat number.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/restaurants" className="w-full sm:w-auto bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl shadow-red-600/20">
                    Order Now
                  </Link>
                  <Link to="/how-it-works" className="w-full sm:w-auto border-2 border-red-600 text-red-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all transform hover:scale-105">
                    How it Works
                  </Link>
                </div>
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<RestaurantMenu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          </Routes>
        </main>

        <footer className="border-t mt-20 py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-600">
            <div>
              <h3 className="text-red-600 text-2xl font-bold mb-4">CineBite</h3>
              <p className="text-gray-500">Making cinema dining smarter and more enjoyable. From snacks to gourmet meals, we deliver everything to your seat.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/restaurants" className="hover:text-red-600">Find Food</Link></li>
                <li><Link to="/theatre-orders" className="hover:text-red-600">Theatre Mode</Link></li>
                <li><Link to="/about" className="hover:text-red-600">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="hover:text-red-600">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-red-600">Contact Us</Link></li>
                <li><Link to="/vendor/dashboard" className="hover:text-red-600 font-bold text-gray-900 border-t border-gray-100 pt-2 block mt-2">Vendor Portal 🔑</Link></li>
                <li><Link to="/privacy" className="hover:text-red-600">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 mt-16 pt-8 border-t">
            <p>&copy; 2026 CineBite. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
