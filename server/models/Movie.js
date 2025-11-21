const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1888, 'Year must be at least 1888'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  director: {
    type: String,
    required: [true, 'Director is required'],
    trim: true
  },
  plot: {
    type: String,
    trim: true,
    maxlength: [1000, 'Plot description cannot exceed 1000 characters']
  },
  posterUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Poster URL must be a valid HTTP/HTTPS URL']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
movieSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Movie', movieSchema);
