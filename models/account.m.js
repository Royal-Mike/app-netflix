const db = require("./_db");
const table = "accounts";

module.exports = class Account {
	constructor(un, email, fn, dob, pw, role) {
		this.username = un;
		this.email = email;
		this.fullname = fn;
		this.dob = dob;
		this.password = pw;
		this.role = role;
	}
	static async createAccount(data) {
		const rs = await db.add(table, data);
		return rs;
	}
	static async getAccount(un) {
		const rs = await db.get(table, "username", un);
		return rs;
	}
	static async getEmail(un) {
		const rs = await db.email(table, "email", un);
		return rs;
	}
	static async updateUser(data) {
        const rs = await db.updateUser(data);
        return rs;
    }
	static async deleteUser(un) {
        const rs = await db.delete(table, "username", un);
        return rs;
    }
	static async getAllEmailsExceptUsername(un) {
		const rs = await db.getAllEmail(table, "username", un);
		return rs;
	}
	static async updateMyProfile(un, fn, email, dob) {
		const rs = await db.update(table, fn, email, dob, un);
		return rs;
	}
	static async resetPass(pw, un) {
		const rs = await db.resetpw(table, pw, un);
		return rs;
	}
};
