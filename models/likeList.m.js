const db = require('./_db');
const table = "movies"
const fieldName = "checkliked"


module.exports = class LikeList {
  
    static async getAllMovieList(email) 
    {
        const getID = await db.getUserID(email)
        const rtDat = await db.getLikedList(table,fieldName,getID);
        console.log(rtDat);
        return rtDat;
    }
}