const express = require('express');
const router=express.Router();
const User=require('../models/model.js');
const bcrypt = require('bcrypt');
const passport = require('passport');


const validateInput = (req, res, next) => {
    const { userName, password } = req.body;
    const userNameRegex = /([a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*){5,16}/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    
    if (!userNameRegex.test(userName)) {
      req.flash('error', 'Invalid username format. Must be 5-16 characters long and can include letters, numbers, underscores, and hyphens.');
      return res.redirect('/create');
    } 
    else if (!passwordRegex.test(password)) {
      req.flash('error', 'Invalid password format. Must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return res.redirect('/create');
    }
    
    next();
  };

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/login');
}

router.get('/', (req, res) => {
    res.redirect('/users');
  });
  
  router.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users.ejs', { 
      users,
      isAuthenticated: req.isAuthenticated()
    });
  });
  router.get('/create', (req, res) => {
    res.render('create.ejs');
  });
  
  router.get('/login', (req, res) => {
    res.render('login.ejs', { messages: req.flash() });
  });
  
  router.get('/profile', isAuthenticated, (req, res) => {
    res.render('loged.ejs', {
      userName: req.user.userName,
      userId: req.user._id
    });
  });
  
  router.post('/register', validateInput,async (req, res) => {
    try {
      const existingUser = await User.findOne({ userName: req.body.userName });
      
      if (existingUser) {
        req.flash('error', 'User already exists');
        return res.redirect('/create');
      }
      
      const salt = await bcrypt.genSalt();
      const hashPass = await bcrypt.hash(req.body.password, salt);
      const user = new User({ userName: req.body.userName, password: hashPass });
      await user.save();
  
      req.flash('success', 'Account created successfully. Please log in.');
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Server error');
      res.redirect('/create');
    }
  });
  
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));
  
  router.get('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', 'Successfully logged out');
      res.redirect('/login');
    });
  });
  
  router.post('/delete-account', isAuthenticated, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user._id);
      req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Account deleted successfully');
        res.redirect('/users');
      });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Server error');
      res.redirect('/profile');
    }
  });
  
  module.exports=router;
  