const redisClient = require('../services/redis');

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json('Unathorized to process rqeuest1');
  }

  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unathorized to process request2');
    }

    console.log('You shall pass');
    return next();
  })
}

module.exports = {
  requireAuth
}
