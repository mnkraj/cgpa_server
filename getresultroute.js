const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cgpamodel = require("./cgmodel");

router.get("/getresults", async (req, res) => {
  try {
    const results = await cgpamodel.find({});
    res.json(results);
  } catch (e) {
    res.json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
