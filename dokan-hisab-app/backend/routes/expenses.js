const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Add expense
router.post('/', async (req, res) => {
  const expense = new Expense(req.body);
  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get expenses


// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find()
      .sort({ date: -1 })   // newest first
      .lean();              // better performance

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;