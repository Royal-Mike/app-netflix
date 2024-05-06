const genres = [
    { id: 12, name: "Adventure" },
    { id: 14, name: "Fantasy" },
    { id: 16, name: "Animation" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 36, name: "History" },
    { id: 37, name: "Western" },
    { id: 53, name: "Thriller" },
    { id: 80, name: "Crime" },
    { id: 878, name: "Science Fiction" },
    { id: 9648, name: "Mystery" },
    { id: 10402, name: "Music" },
    { id: 10749, name: "Romance" },
    { id: 10751, name: "Family" },
    { id: 10752, name: "War" }
];

function joinGenres(movie) {
    const movieGenres = movie.genre_ids.map(genreId => {
        const genre = genres.find(genre => genre.id === genreId);
        return genre ? genre : { id: genreId, name: "Unknown" };
    });

    const result = movieGenres.map(obj => ({
        id: obj.id,
        name: obj.name
    }));
    
    return result;
}

module.exports = class Search {
    static async searchMovies(input, page) {
        let dat = '';
        const url = `https://api.themoviedb.org/3/search/movie?api_key=f43ff427a1c2cf6304e76bad635f21a9&query=${input}&page=${page}`
        try {
            const response = await fetch(url);
            const json = await response.json();
            dat = json.results;
            dat.forEach(movie => {
                movie.runtime = Math.floor(Math.random() * 3 + 1) + "h " + Math.floor(Math.random() * 60) + "m";
                movie.genres = joinGenres(movie);
            });
            return dat;
        } catch (err) {
            console.error('Error:', err);
            return dat;
        }
    }
}