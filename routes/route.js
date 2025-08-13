const express = require('express');
const mongoose = require('mongoose');
const Guest = require('./models/Guest');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST: lưu khách mời
app.post('/api/guests', async (req, res) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json({ message: 'Đã lưu thành công', guest });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lưu dữ liệu' });
  }
});
