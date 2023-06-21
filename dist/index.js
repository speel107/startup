const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000; //changed 3000 to 4000

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
let apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getIdentity(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const identity = await DB.createIdentity(req.body.username, req.body.password);

    // Set the cookie
    setAuthCookie(res, identity.token);

    res.send({
      id: identity._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const identity = await DB.getIdentity(req.body.username);
  if (identity) {
    if (await bcrypt.compare(req.body.password, identity.password)) {
      setAuthCookie(res, identity.token);
      res.send({ id: identity._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/identity/:username', async (req, res) => {
  const identity = await DB.getIdentity(req.params.username);
  if (identity) {
    const token = req?.cookies.token;
    res.send({ username: identity.username, authenticated: token === identity.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const identity = await DB.getIdentityByToken(authToken);
  if (identity) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Get all users
secureApiRouter.get('/users', async (_req, res) => {
  const users = await DB.getAllUsers();
  res.send(users);
});

// Get single user
secureApiRouter.get('/user', async (req, res) => {
  const username = req.query.username;
  const user = await DB.getSingleUser(username);
  console.log(user);
  res.send(user);
  console.log("response was sent");
});

// Update user info
secureApiRouter.post('/update', async (req, res) => {
  // const score = { ...req.body, ip: req.ip };
  // added this ^ line to the post request?
  DB.updateUser(req.body);
  const users = await DB.getAllUsers();
  res.send(users);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
