const { createSessions } = require('../services/jwtauth');

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

    return res.json({userId: reply});
  });
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
      .catch(error => {
        console.log(error);
        res.status(400).json("wrong credentials")
      });
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
