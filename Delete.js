const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cgpamodel = require("./cgmodel");

router.delete("/delete", async (req, res) => {
    try {
      const result = await cgpamodel.deleteMany({ Regn: /^2021/ });
      res.status(200).json({
        message: `${result.deletedCount} documents were deleted.`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  module.exports = router;
