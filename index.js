require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const allowedOrigins = '*';

app.use(cors({
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const testimonialSchema = new mongoose.Schema({
    name: String,
    message: String,
    rating: Number,
    status: Boolean
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

app.get('/api/v1/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.options('/api/v1/testimonials', async (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST');
    res.status(200).end();
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/v1/testimonials', async (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST');
    res.status(200).end();
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/v1/testimonials/:id', async (req, res) => {
    try {
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTestimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json(updatedTestimonial);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/v1/testimonials/:id', async (req, res) => {
    try {
        const deletedTestimonial = await Testimonial.findByIdAndRemove(req.params.id);
        if (!deletedTestimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});