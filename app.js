
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const User = require('./models/model.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const router = require('./router/router.js');
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
require("dotenv").config();
app.use(methodOverride('_method'));

// Session setup 
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  { usernameField: 'userName' }, 
  async (userName, password, done) => {
    try {
      const user = await User.findOne({ userName: userName });
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid password' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});



app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected '))
  .catch(err => console.log(err));

app.use('/', router);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});