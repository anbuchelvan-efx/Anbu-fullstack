const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/conn');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Movie Recommendation API',
    version: '1.0.0',
    endpoints: {
      signup: '/api/signup',
      login: '/api/login',
      movies: '/api/movies'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    // Seed initial movies if collection is empty (public demo data)
    try {
      const Movie = require('./models/Movie');
      const seedMovies = [
        {
          title: 'The Dark Knight',
          year: 2008,
          genre: 'Action',
          director: 'Christopher Nolan',
          plot: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.',
          posterUrl: 'https://sm.ign.com/t/ign_latam/movie/t/the-dark-k/the-dark-knight_36qc.1200.jpg'
        },
        {
          title: 'Inception',
          year: 2010,
          genre: 'Sci-Fi',
          director: 'Christopher Nolan',
          plot: 'A thief who steals corporate secrets through dream-sharing technology is tasked to plant an idea.',
          posterUrl: 'https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg'
        },
        {
          title: 'Interstellar',
          year: 2014,
          genre: 'Sci-Fi',
          director: 'Christopher Nolan',
          plot: 'Explorers travel through a wormhole to ensure humanity’s survival.',
          posterUrl: 'https://m.media-amazon.com/images/I/71yAz9T8ZyL._AC_SL1024_.jpg'
        },
        {
          title: 'The Shawshank Redemption',
          year: 1994,
          genre: 'Drama',
          director: 'Frank Darabont',
          plot: 'Two imprisoned men bond over years, finding solace and redemption.',
          posterUrl: 'https://m.media-amazon.com/images/I/519NBNHX5BL._AC_.jpg'
        },
        {
          title: 'The Godfather',
          year: 1972,
          genre: 'Crime',
          director: 'Francis Ford Coppola',
          plot: 'A crime dynasty’s aging patriarch transfers control to his reluctant son.',
          posterUrl: 'https://m.media-amazon.com/images/I/41+eK8zBwQL._AC_.jpg'
        },
        {
          title: 'Parasite',
          year: 2019,
          genre: 'Thriller',
          director: 'Bong Joon-ho',
          plot: 'Class tensions spiral between two families in a gripping thriller.',
          posterUrl: 'https://m.media-amazon.com/images/I/71c05lTE03L._AC_SL1024_.jpg'
        },
        // New movies requested
        { title: 'Gladiator', year: 2000, genre: 'Action / Drama', director: 'Ridley Scott', plot: 'A betrayed Roman general seeks vengeance as a gladiator.', posterUrl: 'https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
        { title: 'Avengers: Infinity War', year: 2018, genre: 'Action / Sci-Fi', director: 'Anthony & Joe Russo', plot: 'The Avengers battle Thanos to stop his universe-ending plan.', posterUrl: 'https://images-na.ssl-images-amazon.com/images/I/A1aHRPvn5JL._RI_.jpg' },
        { title: 'Joker', year: 2019, genre: 'Drama / Thriller', director: 'Todd Phillips', plot: 'Arthur Fleck’s descent into madness births the Joker.', posterUrl: 'https://i.pinimg.com/originals/95/2e/b0/952eb064b99360a16dc258d3186a7e7f.png' },
        { title: 'Titanic', year: 1997, genre: 'Drama / Romance', director: 'James Cameron', plot: 'A tragic romance aboard the ill-fated RMS Titanic.', posterUrl: 'https://originalvintagemovieposters.com/wp-content/uploads/2020/02/TITANIC-8567-scaled.jpg' },
        { title: 'Avatar', year: 2009, genre: 'Sci-Fi / Adventure', director: 'James Cameron', plot: 'A Marine on Pandora is torn between duty and a new home.', posterUrl: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/05/avater-the-way-of-water-poster.jpg' },
        { title: 'The Prestige', year: 2006, genre: 'Mystery / Drama', director: 'Christopher Nolan', plot: 'Rival magicians engage in a dangerous battle of wits.', posterUrl: 'https://c8.alamy.com/comp/DT67F9/hugh-jackman-scarlett-johansson-christian-bale-poster-the-prestige-DT67F9.jpg' },
        { title: 'Avengers: Endgame', year: 2019, genre: 'Action / Sci-Fi', director: 'Anthony & Joe Russo', plot: 'The Avengers assemble for a final stand against Thanos.', posterUrl: 'https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SL1500_.jpg' },
        { title: 'The Wolf of Wall Street', year: 2013, genre: 'Biography / Comedy', director: 'Martin Scorsese', plot: 'Stockbroker Jordan Belfort rises and falls in excess.', posterUrl: 'http://www.danielyeow.com/wp-content/uploads/TheWolfofWallStreet-poster.jpg' },
        { title: 'Dune: Part Two', year: 2024, genre: 'Sci-Fi / Adventure', director: 'Denis Villeneuve', plot: 'Paul Atreides unites with the Fremen to wage war on Arrakis.', posterUrl: 'https://m.media-amazon.com/images/I/81QYVQxH7lL._AC_SL1500_.jpg' },
        { title: 'Oppenheimer', year: 2023, genre: 'Biography / Drama', director: 'Christopher Nolan', plot: 'The story of J. Robert Oppenheimer and the atomic bomb.', posterUrl: 'https://images.wallpapersden.com/image/download/oppenheimer-2023-movie-poster_bmVpamqUmZqaraWkpJRmZ2dprWZnZ2k.jpg' }
      ];

      // Titles to exclude/remove completely (case-insensitive compare)
      const blockedTitles = new Set([
        'dune: part two',
        'joker',
        'interstellar',
        'inception',
        'the dark knight',
        'leo',
        'money heist',
        'stranger things',
        'breaking bad',
        'friends',
        'the crown',
        'the social network'
      ]);

      const activeSeedMovies = seedMovies.filter(m => !blockedTitles.has(String(m.title).toLowerCase()));

      let upserts = 0;
      for (const movie of activeSeedMovies) {
        const { posterUrl, ...rest } = movie;
        const res = await Movie.findOneAndUpdate(
          { title: movie.title, year: movie.year },
          { $setOnInsert: rest, $set: { posterUrl } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if (res) upserts += 1;
      }
      if (upserts > 0) {
        console.log(`Ensured ${upserts} movie record(s)`);
      }

      // Backfill poster URLs for any existing records missing posters, by title
      const postersByTitle = new Map(activeSeedMovies.map(m => [m.title.toLowerCase(), m.posterUrl]));
      const withoutPoster = await Movie.find({ $or: [ { posterUrl: { $exists: false } }, { posterUrl: '' } ] });
      for (const m of withoutPoster) {
        const poster = postersByTitle.get(String(m.title || '').toLowerCase());
        if (poster) {
          await Movie.updateOne({ _id: m._id }, { $set: { posterUrl: poster } });
        }
      }

      // Cleanup: remove blocked titles if present
      const blockedOriginals = Array.from(blockedTitles);
      if (blockedOriginals.length > 0) {
        const toDelete = await Movie.find({});
        const idsToRemove = toDelete
          .filter(doc => blockedTitles.has(String(doc.title).toLowerCase()))
          .map(doc => doc._id);
        if (idsToRemove.length > 0) {
          await Movie.deleteMany({ _id: { $in: idsToRemove } });
          console.log(`Removed ${idsToRemove.length} blocked title(s)`);
        }
      }
    } catch (seedErr) {
      console.warn('Movie seeding skipped:', seedErr.message);
    }
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API base: http://localhost:${PORT}/api`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

