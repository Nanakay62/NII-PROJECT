const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Server Ready"))
    .catch(err => console.log("❌ DB Error", err));

const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String, 
    totalAmount: String,
    status: String,
    date: { type: Date, default: Date.now }
}));

// THE ROUTE - Copy this exactly
app.get('/api/admin/orders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});



// 4. ROUTES (Simplified - No Password Needed)

// Customer submits order
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Admin gets all orders
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching data" });
    }
});
// Admin updates status
app.patch('/api/admin/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { status: 'Shipped' });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// Admin deletes order
app.delete('/api/admin/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.listen(5000, () => console.log("🚀 Server running on Port 5000 - No Auth Mode"));