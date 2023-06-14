const express = require('express');
const app = express();

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
apiRouter.get('/users', (_req, res) => {
  res.send(users);
});

// // Get single user
// apiRouter.get('/users/userID', (_req, res) => {
//   // TODO: this line is incorrect
//   res.send(users);
// });

// Update user info
apiRouter.post('/update', (req, res) => {
  //console.log("updating users...");
  users = updateUsers(req.body, users);
  res.send(users);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// additional functions for calculating things?
let users = [];
function updateUsers(newUser, users) {
  let found = false;
  for (let [i, prevUser] of users.entries()) {
    if (newUser.username === prevUser.username) {
      prevUser = {...prevUser, ...newUser};
      found = true;
    }
  }

  if (!found) {
    users.push(newUser);
  }

  return users;
}