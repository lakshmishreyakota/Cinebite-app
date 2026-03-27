const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, createRestaurant } = require('../controllers/restaurant.controller');
const { protect, vendor } = require('../middlewares/auth.middleware');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, vendor, createRestaurant);

module.exports = router;
