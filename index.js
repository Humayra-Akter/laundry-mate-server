require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const laundryMate = client.db("laundryMate");
    const userCollection = laundryMate.collection("userCollection");
    const selectedItemsCollection = laundryMate.collection(
      "selectedItemsCollection"
    );

    // user routes
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.status(201).send(result);
    });

    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    // Login route
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await userCollection.findOne({ "user.email": email });

      if (!user) {
        return res.status(400).send({ message: "User not found" });
      }
      res.status(200).send({ message: "Login successful", user });
    });

    // selected items
    app.post("/selectedItems", async (req, res) => {
      const selectedItems = req.body;
      const result = await selectedItemsCollection.insertOne(selectedItems);
      res.status(201).send(result);
    });

    // selected items
    app.get("/selectedItems", async (req, res) => {
      const selectedItems = await selectedItemsCollection.find().toArray();
      res.send(selectedItems);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Route is working");
});

app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
