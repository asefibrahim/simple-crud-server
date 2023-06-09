const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000
// ibrahimasif557
// pOOsKEhqLW6i9eYx

app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://ibrahimasif557:pOOsKEhqLW6i9eYx@cluster0.5niozn3.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("UserDB");
        const usersCollection = database.collection("user");


        app.get('/user', async (req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result)
            console.log(result);
        })
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id
            const getUserFormClint = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: getUserFormClint.name,
                    email: getUserFormClint.email
                }
            }
            const result = await usersCollection.updateOne(filter, updatedUser, options)
            res.send(result)
            console.log(result);
        })


        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            console.log(`delete the id no ${id}`);
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);



app.get('/', (req, res) => {
    res.send('Crud is running....')
})

app.listen(port)