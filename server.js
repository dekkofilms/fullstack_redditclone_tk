'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const environment = process.env.NODE_ENV;
const config = require('./knexfile.js')[environment];
const knex = require('knex')(config);
const cookieSession = require('cookie-session')

const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'))

app.use(cookieSession({
  secret: 'booyah',
}));

const auth = require('./routes/auth');
const users = require('./routes/users');
const posts = require('./routes/posts');

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.redirect('/auth/login');
});












app.use('/auth', auth);
app.use('/users', users);
app.use('/posts', posts);

app.listen(PORT, function () {
  console.log('Lisening!');
});

module.exports = app;
