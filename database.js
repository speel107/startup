const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const users = db.collection('users');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

function getAllUsers() {
    // get data for all users
    const query = { type: "user" };
    const cursor = users.find(query);
    return cursor.toArray();
}

// function getSingleUser(username) {
//     // retrieve single user's info
// }

async function updateUser(user) {
    const filter = { username: user.username };
    const update = { $set: { slugname: user.slugname, 
        fill: user.fill,
        outline: user.outline, 
        friends: user.friends } };
    const options = { upsert: false };

    // Update the document
    const response = users.updateOne(filter, update, options, function(err, result) {
        if (err) {
            console.log('Error updating document:', err);
            return;
        }

        console.log('Document updated successfully');
        client.close();
    });
    return response;
}

module.exports = { getAllUsers, updateUser }

// Example object:
// {
//     username = "spensa",
//     password = "spin",
//     slugname = "doomslug",
//     fill = "brightness(0) saturate(100%) invert(89%) sepia(81%) saturate(623%) hue-rotate(343deg) brightness(103%) contrast(94%)",
//     outline = "brightness(0) saturate(100%) invert(92%) sepia(23%) saturate(7148%) hue-rotate(147deg) brightness(93%) contrast(108%)",
//     friends = ["rig", "jorgen"]
// }


// TAKE THIS OUT and put it in database.js (I think)
// function updateUsers(newUser, users) {
//     let found = false;
//     for (let [i, prevUser] of users.entries()) {
//       if (newUser.username === prevUser.username) {
//         prevUser = {...prevUser, ...newUser};
//         found = true;
//       }
//     }
  
//     if (!found) {
//       users.push(newUser);
//     }
  
//     return users;
//   }