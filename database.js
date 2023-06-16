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

async function getProfile(username) {
    // retrieve single user's info
    const query = { username: username };
    const user = await users.findOne(query);
    return user;
}

async function getSingleUser(username) {
    try {
      const user = await getProfile(username);
      return user;
    } catch (error) {
      console.log("Error retrieving profile:", error);
    }
}

async function updateUser(user) {
    const filter = { username: user.username };
    const update = { $set: { 
        username: user.username,
        password: user.password,
        slugname: user.slugname, 
        fill: user.fill,
        outline: user.outline, 
        friends: user.friends,
        type: user.type } };
    const options = { upsert: true };

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

module.exports = { getAllUsers, getSingleUser, updateUser }
