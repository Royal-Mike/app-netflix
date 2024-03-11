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
    createDB: async () => {
        await db.none(`CREATE DATABASE $1:name`, [process.env.DB_NAME]);
        cn.database = process.env.DB_NAME;

        db = pgp(cn);
        con = await db.connect();
        await con.none(`
        CREATE TABLE IF NOT EXISTS public.accounts
        (
            username character varying(100) COLLATE pg_catalog."default" NOT NULL,
            email text COLLATE pg_catalog."default",
            password character varying(100) COLLATE pg_catalog."default",
            dob date,
            role text COLLATE pg_catalog."default",
            CONSTRAINT "account_username_pkey" PRIMARY KEY (username)
        )

        TABLESPACE pg_default;

        ALTER TABLE IF EXISTS public.accounts
            OWNER to postgres;
        `);

        if (con) {
            con.done();
        }
    },
    add: async (tbName, obj) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            // if (tbName !== "accounts") {
            //     const rs = await con.one(`SELECT MAX(${tbName === "catalogue" ? "id_category" : "id"}) FROM ${tbName}`);
            //     if (tbName === "catalogue") obj.id_category = rs.max + 1;
            //     else obj.id = rs.max + 1;
            // }
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
    getAll: async (tbName, order) => {
        let con = null;
        try {
            cn.database = process.env.DB_NAME;
            db = pgp(cn);
            con = await db.connect();
            let rs = await con.any(`SELECT * FROM "${tbName}" ORDER BY ${order}`);
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
    update: async (data) => {
        let con = null;
        try {
            con = await db.connect();
            const condition = pgp.as.format(' WHERE id = ${id}', data); // Placeholders
            let sql = pgp.helpers.update(data, ['field1', 'field2'], 'table') + condition; // Placeholders
            await con.none(sql);
            return 1;
        } catch (error) {
            throw error;
        } finally {
            if (con) {
                con.done();
            }
        }
    }
}