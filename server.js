const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost/smart_education', { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB schema
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const contact = new Contact({ name, email, message });
        await contact.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Smart Education',
            text: `Dear ${name},\n\nThank you for reaching out to us! We have received your message and will get back to you shortly.\n\nBest Regards,\nSmart Education Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send email' });
            }
            console.log('Email sent:', info.response);
        });

        res.status(200).json({ message: 'Message saved and email sent' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Failed to save message' });
    }
});


// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Serve the thank-you page
app.get('/thank-you.html', (req, res) => {
    res.sendFile(__dirname + '/public/thank-you.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
