require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});

const testimonialSchema = new mongoose.Schema({
 name: String,
 message: String,
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

app.get('/testimonials', async (req, res) => {
 const testimonials = await Testimonial.find();
 res.json(testimonials);
});

app.post('/testimonials', async (req, res) => {
 const testimonial = new Testimonial(req.body);
 await testimonial.save();
 res.status(201).json(testimonial);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});