const jwt = require('jsonwebtoken');
const redisClient = require('../services/redis');

const signToken = (email) => {
  var jwtPayload = { email };

  // TODO: store this key in .env like process.env.JWT_SECRET
  return jwt.sign(jwtPayload, 'secret', { expiresIn: '2 days'});
}

const setToken = (token, id) => {
  // token as key, id as value
  console.log(token);
  console.log(id);
  return Promise.resolve(redisClient.set(token, id))
}

const createSessions = (user) => {
  // JWT Token and return user data
  const { email, id } = user;
  const token = signToken(email);

  return setToken(token, id)
    .then(() =>  { return {success: 'true', userId: id, token: token }})
    .catch(error => console.log(error));

}

module.exports = {
  createSessions
}
