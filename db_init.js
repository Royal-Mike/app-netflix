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

async function dropDatabase() {
	try {
		await pool.query('DROP TABLE IF EXISTS movie_genres CASCADE');
		await pool.query('DROP TABLE IF EXISTS ratings CASCADE');
		await pool.query('DROP TABLE IF EXISTS upcoming_movies CASCADE');
		await pool.query('DROP TABLE IF EXISTS now_playing_movies CASCADE');
		await pool.query('DROP TABLE IF EXISTS top_rated_movies CASCADE');
		await pool.query('DROP TABLE IF EXISTS popular_movies CASCADE');
		await pool.query('DROP TABLE IF EXISTS movies CASCADE');
		await pool.query('DROP TABLE IF EXISTS genres CASCADE');
		await pool.query('DROP TABLE IF EXISTS users CASCADE');

		console.log('Old database dropped successfully');
	} catch (error) {
		console.error('Error dropping old database:', error);
	}
}

async function createDatabase() {
	try {
		console.log('Connected to PostgreSQL server.');

		await pool.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				username VARCHAR(50) UNIQUE NOT NULL,
				email VARCHAR(100) UNIQUE NOT NULL,
				dob date,
				password VARCHAR(100) NOT NULL,
				role text
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

		await pool.query(`
			CREATE TABLE IF NOT EXISTS upcoming_movies (
				movie_id INTEGER REFERENCES movies(id),
				PRIMARY KEY (movie_id)
			);
		`);

		await pool.query(`
			CREATE TABLE IF NOT EXISTS now_playing_movies (
				movie_id INTEGER REFERENCES movies(id),
				PRIMARY KEY (movie_id)
			);
		`);

		await pool.query(`
			CREATE TABLE IF NOT EXISTS top_rated_movies (
				movie_id INTEGER REFERENCES movies(id),
				PRIMARY KEY (movie_id)
			);
		`);

		await pool.query(`
			CREATE TABLE IF NOT EXISTS popular_movies (
				movie_id INTEGER REFERENCES movies(id),
				PRIMARY KEY (movie_id)
			);
		`);

		console.log('Movie tables created successfully');
	} catch (error) {
		console.error('Error creating movie tables:', error);
	}
}

async function importMovies() {
	try {
		const movieTypes = ['upcoming', 'now_playing', 'top_rated', 'popular'];

		for (const movieType of movieTypes) {
			const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieType}?api_key=${TMDB_API_KEY}`);
			const movies = response.data.results;

			let importedCount = 0;
			let existingCount = 0;

			for (const movie of movies) {
				const { id } = movie;

				// Fetch the full movie details from TMDB API
				const fullMovie = await getMovieDetails(id);

				const { adult, backdrop_path, genres, imdb_id, original_language, original_title, overview, poster_path, production_companies, production_countries, release_date, runtime, tagline } = fullMovie;

				// Check if the movie already exists in the database
				const { rows } = await pool.query('SELECT * FROM movies WHERE tmdb_id = $1', [id]);

				let movieId;

				if (rows.length === 0) {
					// Insert movie into the database if it doesn't exist
					const { rows } = await pool.query(`
						INSERT INTO movies (adult, backdrop_path, genres, tmdb_id, imdb_id, original_language, original_title, overview, poster_path, production_companies, production_countries, release_date, runtime, tagline)
						VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
						RETURNING id
					`, [adult, backdrop_path, JSON.stringify(genres || []), id, imdb_id, original_language, original_title, overview, poster_path, JSON.stringify(production_companies || []), JSON.stringify(production_countries || []), release_date, runtime, tagline]);

					movieId = rows[0].id;
					importedCount++;

					// Insert genres into the genres table and establish movie-genre relations
					for (const genre of genres || []) {
						const { rows: genreRows } = await pool.query('SELECT * FROM genres WHERE id = $1', [genre.id]);

						if (genreRows.length === 0) {
							await pool.query('INSERT INTO genres (id, name) VALUES ($1, $2)', [genre.id, genre.name]);
						}

						await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2)', [movieId, genre.id]);
					}
				} else {
					movieId = rows[0].id;
					existingCount++;
				}

				// Check if the movie already exists in the corresponding movie type table
				const { rows: movieTypeRows } = await pool.query(`SELECT * FROM ${movieType}_movies WHERE movie_id = $1`, [movieId]);

				if (movieTypeRows.length === 0) {
					// Insert movie into the corresponding movie type table if it doesn't exist
					await pool.query(`
						INSERT INTO ${movieType}_movies (movie_id)
						VALUES ($1)
						ON CONFLICT DO NOTHING
					`, [movieId]);
				}
			}

			console.log(`Table: ${movieType}`);
			console.log(`Imported Movies: ${importedCount}`);
			console.log(`Existing Movies: ${existingCount}`);
			console.log('---');
		}

		console.log('Movies imported successfully');
	} catch (error) {
		console.error('Error importing movies:', error);
	}
}

async function getMovieDetails(movieId) {
	try {
		const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching details for movie ID ${movieId}:`, error);
		return null;
	}
}

async function getMovieGenres(movieId) {
	try {
		const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
		const genres = response.data.genres;
		return genres;
	} catch (error) {
		console.error(`Error fetching genres for movie ID ${movieId}:`, error);
		return [];
	}
}

async function checkGenres() {
	try {
		// Check genres in movies table
		const { rows: movieGenres } = await pool.query('SELECT DISTINCT genres FROM movies');
		console.log('Genres in movies table:', movieGenres);

		// Check genres in genres table
		const { rows: genres } = await pool.query('SELECT * FROM genres');
		console.log('Genres in genres table:', genres);

		// Check movie_genres table
		const { rows: movieGenreRelations } = await pool.query('SELECT * FROM movie_genres');
		console.log('Movie-Genre relations:', movieGenreRelations);

		// Query for the movie "Kung Fu Panda 4"
		const { rows: movie } = await pool.query(`
			SELECT m.*, g.name AS genre_name
			FROM movies m
			LEFT JOIN movie_genres mg ON m.id = mg.movie_id
			LEFT JOIN genres g ON mg.genre_id = g.id
			WHERE m.original_title = 'Kung Fu Panda 4'
		`);

		if (movie.length > 0) {
			console.log('Movie found:', movie[0]);
		} else {
			console.log('Movie not found');
		}
	} catch (error) {
		console.error('Error checking genres and querying movie:', error);
	}
}

async function dbInit() {
	await pool.connect();
	await createDatabase();
	await importMovies();
	await checkGenres();
	pool.end();
}

module.exports = dbInit;