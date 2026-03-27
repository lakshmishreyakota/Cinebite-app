const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');
const Theatre = require('./models/Theatre');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinebite');

    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    await Theatre.deleteMany();

    // Create a Vendor User
    const vendor = await User.create({
      name: 'Cinema Vendor',
      email: 'vendor@example.com',
      password: 'password123',
      role: 'vendor'
    });

    // Create a Theatre
    const theatre = await Theatre.create({
      name: 'PVR IMAX',
      location: 'Forum Mall, Bangalore',
      screens: [
        { number: 'Screen 1', rows: 10, cols: 15 },
        { number: 'Screen 2', rows: 8, cols: 12 }
      ],
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'
    });

    // Create Restaurants
    const r1 = await Restaurant.create({
      name: 'CineMunchies',
      description: 'The best theatre snacks and popcorn.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      category: 'Snacks',
      location: 'Level 1, Forum Mall',
      vendorId: vendor._id,
      isTheatreRestuarant: true,
      theatreId: theatre._id
    });

    const r2 = await Restaurant.create({
      name: 'Burger King',
      description: 'Flame-grilled burgers and fries.',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
      category: 'Fast Food',
      location: 'Main Food Court',
      vendorId: vendor._id
    });

    // Create Food Items
    await FoodItem.create([
      {
        name: 'Classic Salted Popcorn',
        description: 'Large tub of freshly popped salted popcorn.',
        price: 250,
        image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80',
        category: 'Popcorn',
        restaurantId: r1._id
      },
      {
        name: 'Caramel Popcorn',
        description: 'Sweet and crunchy caramel glazed popcorn.',
        price: 300,
        image: 'https://images.unsplash.com/photo-1595475253503-455b8098319f?w=800&q=80',
        category: 'Popcorn',
        restaurantId: r1._id
      },
      {
        name: 'Whopper Junior',
        description: 'The signature flame-grilled beef patty burger.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        category: 'Burgers',
        restaurantId: r2._id
      }
    ]);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
