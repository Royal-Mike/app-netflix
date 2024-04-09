const search = require('../')
module.exports = {
     search: async () => {
    const searchInput = document.getElementById("form-control me-2").value;
const query = "https://api.themoviedb.org/3/search/movie?api_key=f43ff427a1c2cf6304e76bad635f21a9&query="
    // Send search query to the backend
    fetch(query+ {searchInput})
        .then(response => response.json())
        .then(data => {
            // Display search results
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
},

 displayResults: (results) =>{
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    results.forEach(result => {
        const resultElement = document.createElement("div");
        resultElement.textContent = result.name; // Assuming 'name' is a field in your database
        searchResults.appendChild(resultElement);
    });
}
}