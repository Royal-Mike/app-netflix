require('dotenv').config();

const pgp = require('pg-promise')({
    capSQL: true,
    noWarnings: true
});

const cn = {
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    max: process.env.DB_MAX
};

let db = pgp(cn);
let con = null;

module.exports = {
    checkExistDB: async () => {
        const check = await db.any(`SELECT FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
        return check.length;
    },
    // createDB: async () => {
    //     await db.none(`CREATE DATABASE $1:name`, [process.env.DB_NAME]);
    //     cn.database = process.env.DB_NAME;

    //     db = pgp(cn);
    //     con = await db.connect();
    //     await con.none(`
    //     CREATE TABLE IF NOT EXISTS public.accounts
    //     (
    //         username character varying(100) COLLATE pg_catalog."default" NOT NULL,
    //         email text COLLATE pg_catalog."default",
    //         password character varying(100) COLLATE pg_catalog."default",
    //         dob date,
    //         role text COLLATE pg_catalog."default",
    //         CONSTRAINT "account_username_pkey" PRIMARY KEY (username)
    //     )

    //     TABLESPACE pg_default;

    //     ALTER TABLE IF EXISTS public.accounts
    //         OWNER to postgres;
    //     `);

    //     if (con) {
    //         con.done();
    //     }
    // },
    add: async (tbName, obj) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            const rs = await con.one(`SELECT MAX(id) FROM ${tbName}`);
            obj.id = rs.max + 1;
            let sql = pgp.helpers.insert(obj, null, tbName);
            await con.none(sql);
            return 1;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    getCount: async (tbName) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            let rs = await con.one(`SELECT COUNT(*) FROM "${tbName}"`);
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    getAll: async (tbName, order) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();

            let query = '';
            if (tbName === 'genres') {
                query = `SELECT A.*, COUNT(B.movie_id) AS amount FROM genres A LEFT JOIN movie_genres B ON A.id = B.genre_id GROUP BY A.id, A.name ORDER BY A.id`;
            }
            else {
                query = `SELECT * FROM "${tbName}" ORDER BY ${order}`;
            }

            let rs = await con.any(query);
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    getOne: async (tbName, fieldName, value) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            const rs = await con.oneOrNone(
                `SELECT * FROM "${tbName}" WHERE "${fieldName}" = $1`,
                [value]
            );
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    getAny: async (tbName, fieldName, value) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            const rs = await con.any(
                `SELECT * FROM "${tbName}" WHERE "${fieldName}" = $1`,
                [value]
            );
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    delete: async (tbName, fieldName, value) => {
        let con = null;
        try {
            con = await db.connect();
            const rs = await con.none(
                `DELETE FROM "${tbName}" WHERE "${fieldName}" = $1`,
                [value]
            );
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    updateMovie: async (data) => {
        let con = null;
        try {
            con = await db.connect();
            const condition = pgp.as.format(' WHERE id = ${id}', data);
            let sql = pgp.helpers.update(data, ['adult', 'backdrop_path', 'genres', 'original_language', 'original_title', 'overview', 'poster_path', 'production_companies', 'production_countries', 'release_date', 'runtime', 'tagline'], 'movies') + condition;
            await con.none(sql);
            return 1;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    updateGenre: async (data) => {
        let con = null;
        try {
            con = await db.connect();
            const condition = pgp.as.format(' WHERE id = ${id}', data);
            let sql = pgp.helpers.update(data, ['name'], 'genres') + condition;
            await con.none(sql);
            return 1;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    updateAdmin: async (username) => {
        let con = null;
        try {
            con = await db.connect();
            await con.none(
                `UPDATE "users" SET role = 'admin' WHERE username = $1`,
                [username]
            );
            return 1;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    getPopularMovies: async (tbName1, tbName2) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            let rsQuery = await con.any(`SELECT * FROM ${tbName1} AS TB1 JOIN ${tbName2} AS TB2 ON TB1.id = TB2.movie_id`);
            rsQuery.forEach(movie => {
                let runtime = movie.runtime;
                let hour = Math.floor(runtime / 60);
                let minute = runtime % 60;
                movie.runtime = hour + "h " + minute + "m";

                movie.genres[0].isFirst = true;
            });
            let rs = [];
            let save6Movies = [];
            for (let i = 0; i < rsQuery.length; i++) {
                if (i % 6 == 0) {
                    if (save6Movies.length == 0) {
                        save6Movies.push(rsQuery[i]);
                    } else {
                        let isFirst = {
                            checkFirst: true,
                            list6Movies: save6Movies
                        }
                        if (rs.length) {
                            isFirst.checkFirst = false;
                        }
                        rs.push(isFirst);
                        save6Movies = [];
                        save6Movies.push(rsQuery[i]);
                    }
                } else {
                    save6Movies.push(rsQuery[i]);
                }
            }
            if (save6Movies) {
                let isFirst = {
                    checkFirst: true,
                    list6Movies: save6Movies
                }
                if (rs.length) {
                    isFirst.checkFirst = false;
                }
                rs.push(isFirst);
            }
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    getNowPlayingMovies: async (tbName1, tbName2) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            let rsQuery = await con.any(`SELECT * FROM ${tbName1} AS TB1 JOIN ${tbName2} AS TB2 ON TB1.id = TB2.movie_id`);
            rsQuery.forEach(movie => {
                let runtime = movie.runtime;
                let hour = Math.floor(runtime / 60);
                let minute = runtime % 60;
                movie.runtime = hour + "h " + minute + "m";

                movie.genres[0].isFirst = true;
            });
            let rs = [];
            let save6Movies = [];
            for (let i = 0; i < rsQuery.length; i++) {
                if (i % 6 == 0) {
                    if (save6Movies.length == 0) {
                        save6Movies.push(rsQuery[i]);
                    } else {
                        let isFirst = {
                            checkFirst: true,
                            list6Movies: save6Movies
                        }
                        if (rs.length) {
                            isFirst.checkFirst = false;
                        }
                        rs.push(isFirst);
                        save6Movies = [];
                        save6Movies.push(rsQuery[i]);
                    }
                } else {
                    save6Movies.push(rsQuery[i]);
                }
            }
            if (save6Movies) {
                let isFirst = {
                    checkFirst: true,
                    list6Movies: save6Movies
                }
                if (rs.length) {
                    isFirst.checkFirst = false;
                }
                rs.push(isFirst);
            }
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    getTopRatedMovies: async (tbName1, tbName2) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            let rsQuery = await con.any(`SELECT * FROM ${tbName1} AS TB1 JOIN ${tbName2} AS TB2 ON TB1.id = TB2.movie_id`);
            rsQuery.forEach(movie => {
                let runtime = movie.runtime;
                let hour = Math.floor(runtime / 60);
                let minute = runtime % 60;
                movie.runtime = hour + "h " + minute + "m";

                movie.genres[0].isFirst = true;
            });
            let rs = [];
            let save6Movies = [];
            for (let i = 0; i < rsQuery.length; i++) {
                if (i % 6 == 0) {
                    if (save6Movies.length == 0) {
                        save6Movies.push(rsQuery[i]);
                    } else {
                        let isFirst = {
                            checkFirst: true,
                            list6Movies: save6Movies
                        }
                        if (rs.length) {
                            isFirst.checkFirst = false;
                        }
                        rs.push(isFirst);
                        save6Movies = [];
                        save6Movies.push(rsQuery[i]);
                    }
                } else {
                    save6Movies.push(rsQuery[i]);
                }
            }
            if (save6Movies) {
                let isFirst = {
                    checkFirst: true,
                    list6Movies: save6Movies
                }
                if (rs.length) {
                    isFirst.checkFirst = false;
                }
                rs.push(isFirst);
            }
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    },
    getUpcomingMovies: async (tbName1, tbName2) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            let rsQuery = await con.any(`SELECT * FROM ${tbName1} AS TB1 JOIN ${tbName2} AS TB2 ON TB1.id = TB2.movie_id`);
            rsQuery.forEach(movie => {
                let runtime = movie.runtime;
                let hour = Math.floor(runtime / 60);
                let minute = runtime % 60;
                movie.runtime = hour + "h " + minute + "m";

                movie.genres[0].isFirst = true;
            });
            let rs = [];
            let save6Movies = [];
            for (let i = 0; i < rsQuery.length; i++) {
                if (i % 6 == 0) {
                    if (save6Movies.length == 0) {
                        save6Movies.push(rsQuery[i]);
                    } else {
                        let isFirst = {
                            checkFirst: true,
                            list6Movies: save6Movies
                        }
                        if (rs.length) {
                            isFirst.checkFirst = false;
                        }
                        rs.push(isFirst);
                        save6Movies = [];
                        save6Movies.push(rsQuery[i]);
                    }
                } else {
                    save6Movies.push(rsQuery[i]);
                }
            }
            if (save6Movies) {
                let isFirst = {
                    checkFirst: true,
                    list6Movies: save6Movies
                }
                if (rs.length) {
                    isFirst.checkFirst = false;
                }
                rs.push(isFirst);
            }
            return rs;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }
}