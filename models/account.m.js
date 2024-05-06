const db = require("./_db");
const table = "users";

module.exports = class Account {
	constructor(un, em, dob, pw, role) {
		this.username = un;
		this.email = em;
		this.dob = dob;
		this.password = pw;
		this.role = role;
	}
	static async createAccount(data) {
		const rs = await db.add(table, data);
		return rs;
	}
	static async getAccount(un) {
		const rs = await db.getOne(table, "username", un);
		return rs;
	}
	static async getEmail(em) {
		const rs = await db.getOne(table, "email", em);
		return rs;
	}
	static async getUserIdByUsername(username) {
		const rs = await db.getOne(table, "username", username);
		return rs ? rs.id : null;
	}
	static async getSubscription(userid) {
		const rs = await db.getOne("subscriptions", "user_id", userid);
		return rs;
	}
};
