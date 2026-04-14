const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// Add sale
router.post("/", async (req, res) => {
  const {
    productName,
    quantity,
    price,
    paymentType,
    customerName,
    customerPhone,
  } = req.body;
  const total = quantity * price;

  try {
    // Update stock
    const product = await Product.findOne({ name: productName });
    if (product) {
      product.stock -= quantity;
      await product.save();
    }

    // If credit, update customer balance
    if (paymentType === "credit" && customerName && customerPhone) {
      let customer = await Customer.findOne({ phone: customerPhone });
      if (!customer) {
        customer = new Customer({
          name: customerName,
          phone: customerPhone,
          balance: total,
        });
      } else {
        customer.balance += total;
        customer.lastPaymentDate = new Date();
      }
      await customer.save();
    }

    const sale = new Sale({ ...req.body, total });
    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get sales (similar for reports)

// Get sales with filters, pagination & sorting
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      paymentType,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // Filter by payment type
    if (paymentType) {
      query.paymentType = paymentType;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search by product name or customer name
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sales = await Sale.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // improves performance

    const total = await Sale.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: sales,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all sales with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const sales = await Sale.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Sale.countDocuments();

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: sales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
