const Restaurant = require('../models/Restaurant');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a restaurant (Vendor only)
// @route   POST /api/restaurants
// @access  Private/Vendor
exports.createRestaurant = async (req, res) => {
  const { name, description, image, category, location, isTheatreRestuarant, theatreId } = req.body;

  try {
    const restaurant = new Restaurant({
      name,
      description,
      image,
      category,
      location,
      vendorId: req.user._id,
      isTheatreRestuarant,
      theatreId
    });

    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
