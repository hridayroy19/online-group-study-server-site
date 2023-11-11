const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const cookieParser = require("cookie-parser");
// const jtw = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// maidlware
app.use(express.json());
app.use(cors({
  origin:'https://online-grup-study.web.app'
}));
// app.use(cookieParser());

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.jg43ilw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


// maidlware
// const logger = async (req, res , next)=>{
// console.log('called', req.hostname,req.orginalUrl);
// next();
// }

// token varifyToken
// const VerifyToken = async(req , res , next)=>{
//   const token = req.cookies?.token;
//   console.log('value of token in medilware', token);
//   if(!token){
//     return res.status(401).send({message:'not authroized'})
//   }
//   jtw.verify(token,process.env.ACCESS_TOKEN,(err ,decoded)=>{
//     if(err){
//       console.log(err);
//       return res.status(401).send({message:'unatuhrized token'})
//     }
//     console.log('value in the token',decoded);
//     req.user = decoded;
//     next()
    
//   })


//   next()
// }


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("asserment");
    const asserementCollaction = database.collection("users");

    // send clint site
    app.get("/users",async (req, res) => {
      const cursor = asserementCollaction.find();
      // console.log("token ", req.cookies.token);
      const result = await cursor.toArray();
      res.send(result);
    });



    // token reletadet auth
    // app.post("/jwt",async (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const token = jtw.sign(user, process.env.ACCESS_TOKEN, {
    //     expiresIn: "1h",
    //   });
    //   console.log(token);
    //   res
    //     .cookie("token", token, {
    //       httpOnly: true,
    //       secure: false,
    //     })
    //     .send({ success: true });
    // });



    // update carteted data
    app.get("/users/:id",async (req, res) => {
      // console.log("token show server site", req.cookies.token);
      const id = req.params.id;
      const queary = { _id: new ObjectId(id) };
      const user = await asserementCollaction.findOne(queary);
      res.send(user);
    });

    // dtles btn

    // app.get('/users/:id', async ( req , res)=>{
    //   const id = req.params.id;
    //   const queary = { _id : new ObjectId(id)}
    //   const user = await asserementCollaction.findOne(queary);
    //   res.send(user)

    // })

    app.post("/users",async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await asserementCollaction.insertOne(user);
      res.send(result);
    });

    // update submite put

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
          date: user.date,
          photo: user.photo,
          pirce: user.price,
          marks: user.marks,
          level: user.level,
        },
      };

      const result = await asserementCollaction.updateOne(
        filter,
        updateUser,
        options
      );
      res.send(result);
    });

    // delet
    app.delete("/users/:id",async (req, res) => {
      const id = req.params.id;
      console.log("please delete form data", id);
      const queary = { _id: new ObjectId(id) };
      const result = await asserementCollaction.deleteOne(queary);
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

app.get("/", (req, res) => {
  res.send("smple asserment is running");
});
app.listen(port, () => {
  console.log(`smple cara is runnnign on port ${port}`);
});
