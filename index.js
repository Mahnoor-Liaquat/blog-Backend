const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const RegisterModel = require('./models/Register');
const LoginModel = require('./models/Register');
const BlogModel = require('./models/Blog'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const connectToDatabase = require('./connectDB');
mongoose.set('strictQuery', false);
connectToDatabase();

// User registration
app.post('/register', async (req, res) => {
    const { fname, lname, email, password } = req.body;

    try {
        const existingUser = await RegisterModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json('Already have an account');
        }

        const newUser = new RegisterModel({ fname, lname, email, password });
        await newUser.save();
        res.status(201).json('Account Created Successfully');
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await LoginModel.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid password');
        }

        res.send('User successfully logged in');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Create a new blog post
app.post('/blogs', async (req, res) => {
    const { title, description, date, user } = req.body;

    try {
        const blog = new BlogModel({ title, description, date, user });
        await blog.save();
        res.status(201).send(blog);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all blog posts
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await BlogModel.find();
        res.status(200).send(blogs);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get a single blog post by ID
app.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }
        res.status(200).send(blog);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a blog post by ID
app.put('/blogs/:id', async (req, res) => {
    try {
        const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }
        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Delete a blog post by ID
app.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await BlogModel.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog post not found');
        }
        res.status(200).send('Blog post deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3001, () => {
    console.log('Server is Running on port 3001');
});
