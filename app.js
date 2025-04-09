const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const User=require('./models/model.js');
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
require("dotenv").config();
app.use(methodOverride('_method')); 


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('connected'))
.catch(err=>console.log(err));



app.get('/',(req,res)=>{
    res.redirect('/users');
})

app.get('/users',async (req, res) => {
    const users=await User.find()
    res.render('users.ejs', {users});
});

// Routes for the form pages
app.get('/create', (req, res) => {
    res.render('create.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});
app.get('/loged', async (req, res) => {
    const userName = req.query.userName;
    
    const user = await User.findOne({userName: userName});
    
    if (!user) {
        return res.status(404).send('User not found');
    }
    
    res.render('loged.ejs', {
        userName: userName,
        userId: user._id 
    });
});
app.get('/loged/delete',async (req,res)=>{
    res.render('users.ejs');});

app.post('/register', async (req, res) => {
    const users=await User.find()
    const nameExists = users.find(user => user.userName === req.body.userName);
    
    if(nameExists) {
        return res.status(400).send('User already exists');
    }
    
    try {
        const salt = await bcrypt.genSalt();
        const hashPass = await bcrypt.hash(req.body.password, salt);
        const user = new User({userName: req.body.userName, password: hashPass});
        await user.save();

        res.status(201).redirect('/users');
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    const users=await User.find()
    const user = users.find(user => user.userName === req.body.userName);
    if(!user) {
        return res.status(400).send('User not found');
    }
    
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.redirect(`/loged?userName=${user.userName}`);
        } else {
            res.status(401).send('Invalid password');
        }
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.post('/loged/delete/:id',async (req,res)=>{
    const id =req.params.id;
    try{
        await User.findByIdAndDelete(id);
        res.redirect('/users');
    }
    catch{
        res.status(500).send('Server error');
    }
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});