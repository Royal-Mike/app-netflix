require('dotenv').config();
const axios = require('axios');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.PORT_DB,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  max: process.env.DB_MAX
});

const TMDB_API_KEY = '7fa5ab1cc07d8b360250d25148c880eb';

async function createDatabase() {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL server.');

    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        adult BOOLEAN,
        backdrop_path VARCHAR(255),
        genres JSONB,
        tmdb_id INTEGER,
        imdb_id VARCHAR(20),
        original_language VARCHAR(10),
        original_title VARCHAR(255),
        overview TEXT,
        poster_path VARCHAR(255),
        production_companies JSONB,
        production_countries JSONB,
        release_date DATE,
        runtime INTEGER,
        tagline VARCHAR(255)
      )
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS genres (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS movie_genres (
      movie_id INTEGER REFERENCES movies(id),
      genre_id INTEGER REFERENCES genres(id),
      PRIMARY KEY (movie_id, genre_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      movie_id INTEGER REFERENCES movies(id),
      rating INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    console.log('Movies table created successfully');
  } catch (error) {
    console.error('Error creating movies table:', error);
  }
}

async function importMovies() {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`);
    const movies = response.data.results;

    for (const movie of movies) {
      const { adult, backdrop_path, genres, id, imdb_id, original_language, original_title, overview, poster_path, production_companies, production_countries, release_date, runtime, tagline } = movie;

      // Check if the movie already exists in the database
      const { rows } = await pool.query('SELECT * FROM movies WHERE tmdb_id = $1', [id]);

      if (rows.length === 0) {
        // Insert movie into the database if it doesn't exist
        await pool.query(`
          INSERT INTO movies (adult, backdrop_path, genres, tmdb_id, imdb_id, original_language, original_title, overview, poster_path, production_companies, production_countries, release_date, runtime, tagline)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [adult, backdrop_path, JSON.stringify(genres), id, imdb_id, original_language, original_title, overview, poster_path, JSON.stringify(production_companies), JSON.stringify(production_countries), release_date, runtime, tagline]);

        console.log(`Imported movie: ${original_title}`);
      } else {
        console.log(`Movie already exists: ${original_title}`);
      }
    }

    console.log('Movies imported successfully');
  } catch (error) {
    console.error('Error importing movies:', error);
  } finally {
    await pool.end();
  }
}

async function dbInit() {
  await createDatabase();
  await importMovies();
}
module.exports = dbInit;