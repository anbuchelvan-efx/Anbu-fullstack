const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// POST /api/movies - Disabled: creation is not allowed
router.post('/', (req, res) => {
  return res.status(405).json({
    success: false,
    message: 'Creating movies is disabled'
  });
});

// GET /api/movies - Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies
    });

  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/movies/:id - Get a single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      movie
    });

  } catch (error) {
    console.error('Get movie error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/movies/:id - Disabled: updates are not allowed
router.put('/:id', (req, res) => {
  return res.status(405).json({
    success: false,
    message: 'Updating movies is disabled'
  });
});

// DELETE /api/movies/:id - Disabled: deletion is not allowed
router.delete('/:id', (req, res) => {
  return res.status(405).json({
    success: false,
    message: 'Deleting movies is disabled'
  });
});

module.exports = router;
