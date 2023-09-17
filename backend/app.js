const express = require("express");
const app = express();
app.use(express.json())


//Import routes
const router=require("./routes/productRoute");
app.use("/api/v1",router);


module.exports=app;