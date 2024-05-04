const db = require('./_db');
const table = "playlist"
const fieldName = "userid"


module.exports = class List {

    
    static async getAllMovieList(email) 
    {
        
        const getID = await db.getUserID(email)

        const rtDat = await db.getMovieList(table,fieldName,getID);
        
        console.log(rtDat);
        return rtDat;
    }
}