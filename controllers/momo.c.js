const crypto = require('crypto');
const https = require('https');

const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var requestId = partnerCode + new Date().getTime();
var orderId = requestId;
const requestType = "captureWallet";
const extraData = "";
module.exports = {
  getPayUrl: async (orderInfo, redirectUrl, ipnUrl, amount) => {
    try {
      const requestId = partnerCode + new Date().getTime();
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

      const requestBody = JSON.stringify({
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'en',
      });

      const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      };

      return new Promise((resolve, reject) => {
        const paymentRequest = https.request(options, (paymentResponse) => {
          paymentResponse.setEncoding('utf8');
          let paymentData = '';

          paymentResponse.on('data', (chunk) => {
            paymentData += chunk;
          });

          paymentResponse.on('end', () => {
            const paymentResult = JSON.parse(paymentData);
            resolve(paymentResult.payUrl);
          });
        });

        paymentRequest.on('error', (error) => {
          console.error('Error getting payment URL:', error);
          reject(error);
        });

        paymentRequest.write(requestBody);
        paymentRequest.end();
      });
    } catch (error) {
      console.error('Error getting payment URL:', error);
      throw error;
    }
  },
};