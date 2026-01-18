const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Required fields
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['electronics', 'apparel', 'home', 'other'],
      message: '{VALUE} is not a valid category'
    }
  },
  
  // Optional fields
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=No+Image'
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
productSchema.index({ category: 1, name: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for price in formatted currency
productSchema.virtual('priceFormatted').get(function() {
  return `₸ ${this.price.toLocaleString('en-US')}`;
});

// Method to update ratings
productSchema.methods.updateRating = function(newRating) {
  const totalRating = this.ratings.average * this.ratings.count;
  this.ratings.count += 1;
  this.ratings.average = (totalRating + newRating) / this.ratings.count;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
