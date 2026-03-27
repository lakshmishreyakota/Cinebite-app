const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], 
    default: 'placed' 
  },
  deliveryType: { 
    type: String, 
    enum: ['home', 'theatre-seat'], 
    default: 'home' 
  },
  theatreSeat: {
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    screen: String,
    seatNumber: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
