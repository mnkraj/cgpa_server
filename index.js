const express = require("express");
const connectDB = require("./Db");
const dotenv = require("dotenv");
const solveforall = require("./Getresults")
const Getresults = require("./getresultroute")
const cors = require("cors");
const Delete = require("./Delete")
const app = express();
app.use(
    cors({
      origin: "*",
  
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
);

connectDB();
dotenv.config();



const port = process.env.PORT;


// solveforall();


app.use("/api/v1", Getresults);
app.use("/api/v1", Delete);
app.get("/",(req,res)=>{
  res.send("kya aapke tooth paste mein namak hai ? ")
})
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

