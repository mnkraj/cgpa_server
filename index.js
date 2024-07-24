const express = require("express");
const connectDB = require("./Db");
const dotenv = require("dotenv");
const Getresults = require("./getresultroute")
const getindividualresult = require("./Getindividualresult")
const bodyParser = require('body-parser');
const solveforall = require("./Getresults")
const cors = require("cors");
const Delete = require("./Delete")
const app = express();
const allowedOrigins = [
  "https://cgpa-leaderboad.vercel.app",
  "https://nitjsr.vercel.app",
  "https://cgpanitjsr.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET"
}));

connectDB();
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT;

// solveforall();

app.use("/api/v1", Getresults);
app.use("/api/v1", getindividualresult);
// app.use("/api/v1", Delete);
app.get("/",(req,res)=>{
  res.send("kya aapke tooth paste mein namak hai ? ")
})
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

