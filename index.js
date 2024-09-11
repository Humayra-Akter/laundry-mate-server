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
    const adminCollection = laundryMate.collection("adminCollection");
    const orderCollection = laundryMate.collection("orderCollection");
    const feedbackCollection = laundryMate.collection("feedbackCollection");

    // user routes
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.status(201).send(result);
    });

    // admin routes
    app.post("/admin", async (req, res) => {
      const admin = req.body;
      const result = await adminCollection.insertOne(admin);
      res.status(201).send(result);
    });





    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    // Update user email
    app.put("/user/email", async (req, res) => {
      const { id, newEmail } = req.body;
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { "user.email": newEmail } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).send({ message: "Email updated successfully" });
      } else {
        res.status(400).send({ message: "Failed to update email" });
      }
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

    // ordered items
    app.post("/orderedItems", async (req, res) => {
      const orderedItems = req.body;
      const result = await orderCollection.insertOne(orderedItems);
      res.status(201).send(result);
    });

    // selected items
    app.get("/orderedItems", async (req, res) => {
      const orderedItems = await orderCollection.find().toArray();
      res.send(orderedItems);
    });

    // feedback
    app.post("/feedback", async (req, res) => {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
      res.status(201).send(result);
    });

    // feedback
    app.get("/feedback", async (req, res) => {
      const feedback = await feedbackCollection.find().toArray();
      res.send(feedback);
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
