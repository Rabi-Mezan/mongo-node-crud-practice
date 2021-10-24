const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

//user name : dbuser2
// password: M4vaqPbcqJj8FrF3

app.use(cors())
app.use(express.json())

// connection uri
const uri = "mongodb+srv://dbuser2:M4vaqPbcqJj8FrF3@cluster0.krqaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);


async function run() {
    try {
        // Connect the client to the server
        await client.connect();


        // create a database for clicent and add a collection to your databse
        const database = client.db("ourUsers");
        const userCollection = database.collection("users")

        // get/read api
        app.get('/users', async (req, res) => {

            const cursor = userCollection.find()
            const users = await cursor.toArray();
            // console.log('reading user');
            res.send(users)
        })

        // post api
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user);
            console.log('Added user for id no', result);
            res.json(result)
        })


        // delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            // console.log('delete request for id ', result);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("hello from server");
})


app.listen(port, () => {
    console.log('runnig port no ', port);
})