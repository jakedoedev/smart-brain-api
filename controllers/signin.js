const jwt = require('jsonwebtoken');
// const redisClient = require('../middleware/authorization').redisClient();

// Setup Redis
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URI);

const checkUserCredentials = (req, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }

  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;

  // reply = return value from key token
  redisClient.get(authorization, (err, reply) => {
    console.log(reply);
    if(err || !reply){
      return res.status(400).json('Unauthorized');
    }

    return res.json({id: reply});
  });
}

const signToken = (email) => {
  var jwtPayload = { email };

  // TODO: store this key in .env like process.env.JWT_SECRET
  return jwt.sign(jwtPayload, 'secret', { expiresIn: '2 days'});
}

const setToken = (token, id) => {
  // token as key, id as value
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

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;

  return authorization
    ? getAuthTokenId(req, res)
    : checkUserCredentials(req, db, bcrypt)
      .then( data => {
        return data.id && data.email
        ? createSessions(data)
        : Promise.reject(data);
      })
      .then(session => res.json(session))
      .catch(error => res.status(400).json("wrong credentials"));
}

const signout = () => (req, res) => {
  const { authorization } = req.headers;
  console.log('signout reached');
  console.log(authorization);

  return redisClient.del(authorization, (err, reply) => {
    console.log(reply);
    if(reply === 1){
      return res.json(true);
    }
  })
}

module.exports = {
  signinAuthentication: signinAuthentication,
  signout: signout,
  redisClient: redisClient
}
