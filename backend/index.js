const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.PAY_KEY);
const jwt=require('jsonwebtoken');
const port = process.env.PORT || 5000;

// console.log(process.env.PAY_KEY)

//middlewares
app.use(cors());
app.use(express.json());

//verify token middlewares
const verifyJWTtoken=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(!authHeader){
    return res.status(401).send('unauthorized access');
  }
  const token=authHeader.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
    if(err){
      return res.status(403).send({message:'forbidden access'});
    }
    req.decoded=decoded;
    next();
  })

}

//mongoconnection

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@yoga-master.0thkwfd.mongodb.net/?retryWrites=true&w=majority&appName=yoga-master`;

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

    // create a database and collections
    const database = client.db("yoga-master");
    const usersCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");

    //generate token
    app.post('/api/set-token',async(req,res)=>{
      const user=req.body;
      const token=jwt.sign(user,process.env.ACCESS_TOKEN,{
        expiresIn:'24h'
      });
      res.send({token:token});
    })

    // middlewre for admin and instructor
    const verifyAdmin=async(req, res, next)=>{
      const email=req.decoded.email;
      const query={email:email}
      const requesterAccount=await usersCollection.findOne(query);
      if(requesterAccount.role==='admin'){
        next();
      }
      else{
        res.status(403).send({message:'forbidden'});
      }
    }

    const verifyInstructor=async(req,res,next)=>{
      const email=req.decoded.email;//It extracts the email property from the decoded object, which is likely obtained from a JWT (JSON Web Token) token in the request.


      const query={email:email}//It creates a query object with the email as the key
      const requesterAccount=await usersCollection.findOne(query);
      if(requesterAccount.role==='instructor'){
        next();
      }
      else{
        res.status(403).send({message:'forbidden'});
      }
    
    }

    //routes for users
    app.post('/new-user',async(req,res)=>{
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    
    })

    app.get('/users',async(req,res)=>{
      const result=await usersCollection.find({}).toArray();
      res.send(result);
    })

    app.get('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await usersCollection.findOne(query);
      res.send(result);
    })

    app.get('/user/:email',verifyJWTtoken,async(req,res)=>{
      const email=req.params.email;
      const query={email:email};
      const result=await usersCollection.findOne(query);
      res.send(result);
    })
    app.delete('/delete-user/:id',verifyJWTtoken,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await usersCollection.deleteOne(query);
      res.send(result);
    
    })

    app.put('/update-user/:id',verifyJWTtoken,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const updateUser=req.body;
      const filter={_id: new ObjectId(id)};
      const options={upsert: true};
      const updateDoc={
        $set:{
          name:updateUser.name,
          email:updateUser.email,
          role:updateUser.role,
          address:updateUser.address,
          about:updateUser.about,
          photoUrl:updateUser.photoUrl,
          image:updateUser.skills ? updateUser.skills : null,
        
        }
      };
      const result=await usersCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    
    })

    // classes routes here
    app.post("/new-class",verifyJWTtoken,verifyInstructor, async (req, res) => {
      const newClass = req.body;
      newClass.availableSeats =parseInt(newClass.availableSeats);
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
    });

    //get all data
    app.get("/classes", async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    // get classes by particular instructor from email address
    app.get("/classes/:email",verifyJWTtoken,verifyInstructor, async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    //manage classes
    app.get("/manage-classes", async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    });
    // update classes status and reason
    app.patch("/change-status/:id",verifyJWTtoken,verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const reason = req.body.reason;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
          reason: reason,
        },
      };
      const result = await classesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // get approved classes
    app.get("/approved-classes", async (req, res) => {
      const query = { status: "approved" };
      // console.log(query);
      // console.log(req.query);
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    //get signle class details
    app.get("/class/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classesCollection.findOne(query);
      res.send(result);
    });

    // update class details (all data)
    app.put("/update-class/:id",verifyJWTtoken,verifyInstructor, async (req, res) => {
      const id = req.params.id;
      const updateClass = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videolink: updateClass.videolink,
          status: "pending",
        },
      };
      const result = await classesCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    //!Cart Collection
    // Cart Routes ---
    app.post("/add-to-cart",verifyJWTtoken, async (req, res) => {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result);
    });

    // get Cart item by id
    app.get("/cart-item/:id",verifyJWTtoken, async (req, res) => {
      const id = req.params.id;
      const email = req.body.email;
      const query = {
        classId: id,
        userMail: email,
      };
      const projection = { classId: 1 };
      const result = await cartCollection.findOne(query, {
        projection: projection,
      });
      res.send(result);
    });

    // cart info by user email
    app.get("/cart/:email",verifyJWTtoken, async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const projection = { classId: 1 };
      const carts = await cartCollection.find(query, {
        projection: projection,
      }).toArray();
      const classIds = carts.map((cart) => new ObjectId(cart.classId));
      const query2 = { _id: { $in: classIds } };
      const result = await classesCollection.find(query2).toArray();
      res.send(result);
    });

    // delete cart item
    app.delete("/delete-cart-item/:id",verifyJWTtoken, async (req, res) => {
      const id = req.params.id;
      const query = { classId: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //!payment gateway(routes)
    // PAYMENT Routes
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price) * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // post payment info to db
    app.post("/payment-info",verifyJWTtoken, async (req, res) => {
      const paymentInfo = req.body;
      const classesId = paymentInfo.classesId;
      const userEmail = paymentInfo.userEmail;
      const signleClassId = req.query.classId;
      let query;
      if (signleClassId) {
        query = { classId: signleClassId, userMail: userEmail };
      } else {
        query = { classId: { $in: classesId } };
      }
      const classesQuery = {
        _id: { $in: classesId.map(id => new ObjectId(id))}};
      const classes = await classesCollection.find(classesQuery).toArray();
      const newEnrolledData = {
        userEmail: userEmail,
        classId: classesId.map(id => new ObjectId(id)),
        trasnsactionId: paymentInfo.trasnsactionId
        };
        const updatedDoc = {
        $set: {
        totalEnrolled: classes.reduce((total, current) => total + current.totalEnrolled, 0) + 1 || 0,
        availableSeats: classes.reduce((total, current) => total + current.availableSeats, 0) - 1 || 0
        }
        };
        const updatedResult = await classesCollection.updateMany (classesQuery, updatedDoc, {upsert: true});
        const enrolledResult=await enrolledCollection.insertOne(newEnrolledData);
        const deleteResult=await cartCollection.deleteMany(query);
        const paymentResult=await paymentCollection.insertOne(paymentInfo);

        res.send({paymentResult,deleteResult,enrolledResult,updatedResult});
        
    });

    app.get('/payment-history/:email',async(req,res)=>{
      const email=req.params.email;
      const query={userEmail:email};
      const result=await paymentCollection.find(query).sort({date:-1}).toArray();
      res.send(result);
    })

    //payment history length
    app.get("/payment-history-length/:email",async(req,res)=>{
      const email=req.params.email;
      const query={userEmail:email};
      const total=await paymentCollection.countDocuments(query);
      res.send({total});
    
    })

    //enrollment routes
    app.get("/popular_classes",async(req,res)=>{
      // const query={status:"approved"};
      const result=await classesCollection.find().sort({totalEnrolled:-1}).limit(6).toArray();
      res.send(result);
    })

    app.get("/popular-instructors",async(req,res)=>{
      const pipeline=[
        {
          $group:{
            _id:"$instructorEmail",
            totalEnrolled:{$sum:"$totalEnrolled"}
          }
        },
        {
          $lookup:{
            from:"users",
            localField:"_id",
            foreignField:"email",
            as:"instructor"
          
          }
        },
        {
          $match:{
            "instructor.role":"instructor"
          
          }
        },
        {
          $project:{
            _id:0,
            instructor:{$arrayElemAt:["$instructor",0]},
            totalEnrolled:1,
            
          
          }
        },
        {
          $sort:{
            totalEnrolled:-1
          }
        },
        {
          $limit:6
        }
      
      ]
      const result=await classesCollection.aggregate(pipeline).toArray();
      res.send(result);
    })

    //admin-status
    app.get("/admin-stats",verifyJWTtoken,verifyAdmin,async(req,res)=>{
      const approvedClasses=((await classesCollection.find({status:'approved'})).toArray()).length;
      const pendingClasses=((await classesCollection.find({status:'pending'})).toArray()).length;
      const instructors=(await ((await usersCollection.find({role:'instructor'})).toArray())).length;
      const totalClasses=(await classesCollection.find().toArray()).length;
      const totalEnrolled=(await enrolledCollection.find().toArray()).length;

      const result={
        approvedClasses,
        pendingClasses,
        instructors,
        totalClasses,
        totalEnrolled
      
      }

      res.send(result);
    })

    // get all instructor
    app.get('/instructors',async(req,res)=>{
      const query={role:'instructor'};
      const result=await usersCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/enrolled-classes/:email',verifyJWTtoken,async(req,res)=>{
      const email=req.params.email;
      const query={userEmail:email};
      const pipeline=[
        {
          $match:query
        },
        {
          $lookup:{
            from:"classes",
            localField:"classesId",
            foreignField:"_id",
            as:"classes"
          
          }
        },
        {
          $unwind:"$classes"
        },
        {
          $lookup:{
            from:"users",
            localField:"classes.instructorEmail",
            foreignField:"email",
            as:"instructor"

          
          }
        },
        {
          $project:{
            _id:0,
            classes:1,
            instructor:{
              $arrayElemAt:["$instructor",0]
            }
            
            

          
          }
        }
      ]

      const result=await enrolledCollection.aggregate(pipeline).toArray();
      // const result=await enrolledCollection.find(query).toArray();
      res.send(result);
    })
    
    //applied for instructor
    app.post('/as-instructor',async(req,res)=>{
      const data=req.body;
      const result=await appliedCollection.insertOne(data);
      res.send(result);
    
    })

    app.get('/applied-instructors/:email',async(req,res)=>{
      const email=req.params.email;
      // const query={userMail:email};
      const result=await appliedCollection.findOne({email});
      res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Db Connected");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
