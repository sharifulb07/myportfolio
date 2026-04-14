const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// CREATE Customer
router.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET All Customers
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

module.exports = router;
