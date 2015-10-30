var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var sessions = require('client-sessions');
var User = require('./models/users').User;
var app = express();
var router = express.Router();


app.set('view engine', 'jade');

app.use(bodyParser.urlencoded());
app.use(sessions({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'jofqjewojwqjfoiejwqfoiqwjfiowq', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

function auth(req,res, next) {
  if(req.session && req.session.user) {
    User.findOne({ email: req.session.user.email } , function (err,user) {
      if(!user) {
        req.session.reset();
        res.redirect('/login');
      } else {
        res.locals.user = user.email;
        next();
      }
    })
  } else {
    res.redirect('/login');
  }
}


app.get('/', auth, function(req,res) {
  res.render('index');
});

app.get('/login' , function(req,res) {
  res.render('login');
});

app.post('/login',function (req,res) {
  var body = req.body;
  if(!body.email || !body.password) {
    res.end('please provide password');
  } else {
    User.findOne({ email: body.email } , function(err, user) {
      if(err) throw err;
      if(!user) {
        res.end('Sorry, no such user!');
      } else {
        if(bcrypt.compareSync(body.password, user.password)) {
          req.session.user = user;
          res.redirect('/');
        } else {
          res.end('bad login or password');
        }
      }
    });
  }
})

app.get('/register', function (req,res) {
  res.render('register')
});

app.post('/register', function (req,res) {
  var body = req.body;
  if(!body.email || !body.password) {
    res.end('please provide login and password');
  } else {
    var hash = bcrypt.hashSync(body.password, bdcrypt.genSaltSync(10));
    var newUser = new User({
      email: body.email,
      password: hash
    });
    newUser.save(function(err) {
      if(err) throw err;
      req.sessions.user = newUser.email;
      res.redirect('/');
    });
  }
});

app.get('/logout', function (req,res) {
  req.session.reset();
  res.redirect('/login');
});
app.listen(3000);
