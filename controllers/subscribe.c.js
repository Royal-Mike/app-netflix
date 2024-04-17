const subscribeM = require('../models/subscribe.m');
const momoC = require('../controllers/momo.c');
module.exports = {
    getSubscribePage: (req, res) => {
    let theme = req.cookies.theme;
    let dark = theme === "dark" ? true : false;
    res.render('subscribe', { title: 'Subscribe', dark: dark });
    },
    processSubscription: async (req, res) => {
        try {
        const user_id = req.user.id;
        const subscribe_code = await subscribeM.generateSubscribeCode();
        const redirectUrl = `${req.protocol}://${req.get('host')}/subscribe/activate?subscribe_code=${subscribe_code}`;
        const ipnUrl = `${req.protocol}://${req.get('host')}/payment/notify`;
        const orderInfo = "Subscription Payment";
        const paymentUrl = await momoC.getPayUrl(orderInfo, redirectUrl, ipnUrl);
    
        await subscribeM.createSubscription(user_id, subscribe_code, 'none', new Date(), null);
    
        res.redirect(paymentUrl);
        } catch (error) {
        console.error('Error processing subscription:', error);
        res.redirect('/subscribe');
        }
    },
    activateSubscription: async (req, res) => {
        try {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;

          const subscribe_code = req.query.subscribe_code;
          const subscription = await subscribeM.getSubscriptionByCode(subscribe_code);
      
          if (subscription) {
            await subscribeM.updateSubscription({
                subscribe_code: subscribe_code,
                status: 'subscribed',
                start_date: new Date(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              });
        
            res.render('activate', { title: 'Subscription Activated', dark: dark });
          } else {
            throw new Error('Invalid subscription');
          }
        } catch (error) {
          console.error('Error activating subscription:', error);
          res.redirect('/subscribe');
        }
      },
      

    processTrial: async (req, res) => {
        try {
        const user_id = req.user.id;
        const subscribe_code = await subscribeM.generateSubscribeCode();
        
        await subscribeM.createSubscription(user_id, subscribe_code, 'trial', new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
        
        res.redirect('/home');
        } catch (error) {
        console.error('Error processing trial:', error);
        res.redirect('/subscribe');
        }
    }
};
