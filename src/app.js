const express = require("express");
const mongoose = require("mongoose");
// environment variable
const dotenv = require("dotenv");
const cors = require("cors");

const Customer = require("./customer");

const app = express();
mongoose.set("strictQuery", false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;
// console.log(typeof CONNECTION + " mongoose link");

const Data = {
  Name: "Varsha",
  Profession: "Developer",
  Skills: ["JS", "React", "NextJs", "Tailwind"],
  Friends: ["Sid", "Anju", "Harry", "Dipak"],
  FamilyMembers: [
    {
      name: "mom",
      relationship: "parent",
    },
    {
      name: "Sonali",
      relationship: "Sister",
    },
  ],
};

//  customer.save();   // save on mongobd
app.get("/", (req, res) => {
  console.log("welcome to nodejs");
  res.send("Welcome to my world!");
});
app.get("/api/customers", async (req, res) => {
  try {
    const result = await Customer.find();
    // console.log("result" + result);
    // res.send("List of Customers")
    res.json({ customers: result });
    console.log(
      (await mongoose.connection.db.listCollections().toArray()) +
        "list of collection"
    );
  } catch (e) {
    res.status(500).json({ error: e.massage });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query,
  });
  //   const customerId = req.params.id    /* destructre  const {id} = req.params console.log(id) */
  const { id: customerId } = req.params;
  console.log(customerId);
  try {
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ customer });
    }
  } catch (e) {
    console.log("something wrong data fetching");
    res.status(500).json({ error: "Something data wrong" });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(customer);
    res.json({ customer });
  } catch (e) {
    console.log(e.message);
    res.json({ error: "something missing" });
  }
});

app.patch("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(customer);
    res.json({ customer });
  } catch (e) {
    console.log(e.message);
    res.json({ error: "something missing" });
  }
});


app.patch("/api/orders/:id", async (req, res) => {
  console.log(req.params);
  const orderId = req.params.id;
  req.body._id = orderId
  try {
    const order = await Customer.findOneAndUpdate(
      { "orders._id": orderId },
      { $set: { "orders.$": req.body } },
      { new: true }
    );
    console.log(order);
    res.json({ order });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: "something wrong in the order" });
  }
});

app.get("/api/orders/:id", async(req, res)=>{
  const orderId = req.params.id;

  try{
    const result = await Customer.findOne({'orders._id' : orderId});
    console.log(result)
    if(result){
      res.status(202).json({result})
    }else{
      res.status(404).json({error: "order not"})
    }
  }catch(e){
    console.log(e.message)
    res.status(404).json({error:"order Id is Invalid"})
  }
})
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    res.json({ deleteCount: result.deleteCount });
  } catch (e) {
    res.json({ error: e.message });
  }
});
app.post("/api/customers", async (req, res) => {
  console.log(req.body);
  const customer = await new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const start = async () => {
  try {
    const res = await mongoose.connect(CONNECTION);
    console.log("conected" + res);
    app.listen(PORT, () => {
      console.log("app listen " + PORT);
    });
  } catch (e) {
    console.log("Error section");

    console.log(e.message);
  }
};
start();
