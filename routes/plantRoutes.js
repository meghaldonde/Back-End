const express = require('express');
const router = express.Router();
const {
  getAllPlants,
  createPlant,
  getPlant,
  updatePlant,
  deletePlant,
  uploadPlantImages,
} = require('../controllers/plantController');

const { protect, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .get(getAllPlants)
  .post(protect, restrictTo('grower'), uploadPlantImages, createPlant);

router
  .route('/:id')
  .get(getPlant)
  .patch(protect, uploadPlantImages, updatePlant)
  .delete(protect, restrictTo('grower'), deletePlant);

module.exports = router;
