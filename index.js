const express = require('express');
const app = express();
const DB = require('./database.js');

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000; //changed 3000 to 4000

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
let apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Get all users
apiRouter.get('/users', async (_req, res) => {
  const users = await DB.getAllUsers();
  res.send(users);
});

// Get single user
apiRouter.get('/user', async (req, res) => {
  const username = req.query.username;
  const user = await DB.getSingleUser(username);
  console.log(user);
  res.send(user);
  console.log("response was sent");
  //console.log(res);
});

// Update user info
apiRouter.post('/update', async (req, res) => {
  DB.updateUser(req.body);
  const users = await DB.getAllUsers();
  res.send(users);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
