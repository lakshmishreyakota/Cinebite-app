const express = require('express');
const router = express.Router();
const { getFoodByRestaurant, createFoodItem } = require('../controllers/food.controller');
const { protect, vendor } = require('../middlewares/auth.middleware');

router.get('/restaurant/:restaurantId', getFoodByRestaurant);
router.post('/', protect, vendor, createFoodItem);

module.exports = router;
