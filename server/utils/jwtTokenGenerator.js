// Jwt Token Generator

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated JWT Secret Key:', secretKey);