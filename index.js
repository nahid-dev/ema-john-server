const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// MiddleWere
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Jon is busy shopping");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7rh25i5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollections = client.db("emaJohnDB").collection("products");

    // All Products
    app.get("/products", async (req, res) => {
      // console.log(req.query);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const skip = page * limit;

      const result = await productsCollections
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send(result);
    });
    // Ther server is uploader in github
    app.get("/totalProducts", async (req, res) => {
      const result = await productsCollections.estimatedDocumentCount();
      res.send({ totalProducts: result });
    });

    app.post("/productsById", async (req, res) => {
      const ids = req.body;
      const objectId = ids.map((id) => new ObjectId(id));
      const query = { _id: { $in: objectId } };
      console.log(ids);
      const result = await productsCollections.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
});
