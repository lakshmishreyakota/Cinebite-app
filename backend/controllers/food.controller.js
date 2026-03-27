const FoodItem = require('../models/FoodItem');

// @desc    Get all food items for a restaurant
// @route   GET /api/food/restaurant/:restaurantId
// @access  Public
exports.getFoodByRestaurant = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ restaurantId: req.params.restaurantId });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a food item (Vendor only)
// @route   POST /api/food
// @access  Private/Vendor
exports.createFoodItem = async (req, res) => {
  const { name, description, price, image, category, restaurantId } = req.body;

  try {
    const foodItem = new FoodItem({
      name,
      description,
      price,
      image,
      category,
      restaurantId
    });

    const createdFoodItem = await foodItem.save();
    res.status(201).json(createdFoodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
