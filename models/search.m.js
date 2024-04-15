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
                console.log('test');
            })
            return dat;
        } catch (err) {
            console.error('Error:', err);
            return dat;
        }
    }
}