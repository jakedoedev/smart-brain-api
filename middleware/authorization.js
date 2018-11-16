const redisClient = require('../controllers/signin').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization){
    return res.status(401).json('Unathorized to process rqeuest');
  }

  return redisClient.get(authorization, (err, reply) => {
    if(err || !reply){
      return res.status(401).json('Unathorized to process request');
    }

    console.log('You shall pass');
    return next();
  })
}

module.exports = {
  requireAuth
}
