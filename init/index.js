const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

let mongooseUrl = "mongodb://127.0.0.1:27017/wanderland";

main()
  .then((res) => {
    console.log("Connection Success");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongooseUrl);
}

const initDB = async()=>{
   await Listing.deleteMany({});
   initData.data =initData.data.map((obj)=>({...obj, owner:'68ea3df7a4ae12b54d8c3925'}))
   await Listing.insertMany(initData.data);
   console.log("Data initialized");
}

initDB();