const express = require("express");
const connectDB = require("./Db");
const dotenv = require("dotenv");
const Getresults = require("./getresultroute")
const getindividualresult = require("./Getindividualresult")
const bodyParser = require('body-parser');
const solveforall = require("./Getresults")
const cors = require("cors");
const Delete = require("./Delete")
const scrapeSettings = require("./scrape_settings.json")
const app = express();
const allowedOrigins = [
  "https://cgpa-leaderboad.vercel.app",
  "https://nitjsr.vercel.app",
  "https://cgpanitjsr.vercel.app",
"https://nitjsr-2022-archived.vercel.app",
  "http://localhost:3000",
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST"]
}));

connectDB();
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT;

if (scrapeSettings.scrape) {
  solveforall();
  console.log("Scraping started...");
} else {
  console.log("Scraping is disabled in settings. To enable, set scrape to true in scrape_settings.json and configure the batches and branches you want to scrape.");
}

app.use("/api/v1", Getresults);
app.use("/api/v1", getindividualresult);
// app.use("/api/v1", Delete);
app.get("/",(req,res)=>{
  res.send({success:true,message:"Welcome to the Server"})
})
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

