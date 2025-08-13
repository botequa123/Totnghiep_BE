const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// Kết nối MongoDB
mongoose.connect('mongodb+srv://Tringuyen:bovippro@cluster0.u7gvxwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Schema & Model
const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  attending: { type: Boolean, required: true },
  guests: { type: Number, default: 0 },
  message: String
}, { timestamps: true });

const Guest = mongoose.model('Guest', guestSchema);

// 📌 API: Thêm khách mời
app.post('/api/rsvp', async (req, res) => {
  try {
    let { name, attending, guests, message } = req.body;

    if (!name || attending === undefined) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Convert attending sang boolean nếu là string
    if (typeof attending === 'string') {
      attending = attending.toLowerCase() === 'yes' || attending === 'true';
    }

    const newGuest = new Guest({ name, attending, guests, message });
    const savedGuest = await newGuest.save();

    res.json(savedGuest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// 📌 API: Lấy danh sách khách mời
app.get('/api/guests', async (req, res) => {
  try {
    const { search, attending } = req.query;
    const filter = {};

    if (attending && attending !== 'all') {
      filter.attending = attending === 'yes';
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { message: regex }
      ];
    }

    const guests = await Guest.find(filter).sort({ createdAt: -1 });
    res.json({ items: guests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// 📌 API: Sửa khách mời
app.put('/api/rsvp/:id', async (req, res) => {
  try {
    if (typeof req.body.attending === 'string') {
      req.body.attending = req.body.attending.toLowerCase() === 'yes' || req.body.attending === 'true';
    }

    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedGuest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 API: Xóa khách mời
app.delete('/api/rsvp/:id', async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✨ Server chạy tại http://localhost:${PORT}`);
});
