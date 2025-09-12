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
router.post("/getresults", async (req, res) => {
  try {
    const { regn } = req.body;
    const results = await cgpamodel.findOne({ Regn: regn });
    res.json(results);
  } catch (e) {
    res.json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/update", async (req, res) => {
  const { regn, password, cgpa, sgpa } = req.query;
  const errormessage  = "Aisa Laura Phek Ke marunga na ki puri khandan chud jaayegi tumhari..."
  if (password !== process.env.UPDATE_PASSWORD || !regn || (!cgpa && !sgpa)) {
    return res.json({
      success: false,
      message:
        errormessage,
    });
  }
  try {
    const results = await cgpamodel.findOne({ Regn: regn });
    if (!results) {
      return res.json({ success: false, message: errormessage });
    }
    if (cgpa) results.Cgpa = cgpa;
    if (sgpa) results.Sgpa = sgpa;
    await results.save();
    res.json(results);
  } catch (e) {
    res.json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
