const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const firebase = require('./configs/firebase');
const app = express();

// express middleware setup
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'app-auth-session-key-12346949',
    resave: true,
    saveUninitialized: true,
  })
);

//views setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// defining routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.render('main');        
  } else {
    res.render('landing');    
  }
});

//login routes
app.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    console.log(path.join(__dirname, 'views', 'login.ejs'));
    res.render('login');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).send('Invalid credentials');
  }
});

//signup routes
app.get('/signup', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('signup');    
  }
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('Error signing up');
  }
});

app.get('/private', (req, res) => {
  if (req.session.user) {
    res.render('private');
  } else {
    res.sendStatus(401);
  }
});

//logout route
app.get('/logout', (req, res) => {
  if (req.session.user) {
    firebase.auth().signOut();
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
