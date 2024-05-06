const { get } = require('http');
const db = require('./_db');
const crypto = require('crypto');

module.exports = {
  generateSubscribeCode: async () => {
    let subscribe_code;
    
    do {
        subscribe_code = crypto.randomBytes(5).toString('hex');
    } while (await db.getOne('subscriptions', 'subscribe_code', subscribe_code));
    
    return subscribe_code;
  },
  getSubscriptionByCode: async (subscribe_code) => {
    return await db.getOne('subscriptions', 'subscribe_code', subscribe_code);
  },  
  getSubscriptionByUserId: async (user_id) => {
    return await db.getOne('subscriptions', 'user_id', user_id);
  },
  createSubscription: async (user_id, subscribe_code, status, start_date, end_date) => {
    await db.add('subscriptions', { user_id: user_id, subscribe_code: subscribe_code, status, start_date: start_date, end_date: end_date });
  },
  updateSubscription: async (subscribe_code, status, start_date, end_date) => {
    await db.updateSubscription({ subscribe_code: subscribe_code, status, start_date: start_date, end_date: end_date });
  }  
};
