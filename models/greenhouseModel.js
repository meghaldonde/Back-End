const mongoose = require('mongoose');

const greenhouseSchema = new mongoose.Schema(
  {
    grower: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    // plants: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Plant',
    //   },
    // ], this will be a virtual field when a grower want to create a plant use /ap1/v1/plants (POST)
    ratingsAverage: {
      type: Number,
      default: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    soil: {
      type: {
        type: String,
      },
      temperature: {
        type: Number,
      },
      ph: {
        type: Number,
      },
      water_food: String,
    },
  },
  {
    JSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

greenhouseSchema.virtual('plants', {
  ref: 'Plant',
  foreignField: 'grower',
  localField: '_id',
});

const Greenhouse = mongoose.model('Greenhouse', greenhouseSchema);

module.exports = Greenhouse;
