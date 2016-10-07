'use strict';

const express = require('express');
const router = express.Router();

const environment = process.env.NODE_ENV;
const config = require('../knexfile.js')[environment];
const knex = require('knex')(config);

const bcrypt = require('bcrypt-as-promised');

router.get('/signup', function (req, res) {
  res.render('signup');
});

router.post('/signup', function (req, res) {
  knex('users').where('email', req.body.email).first().then(function (user) {
    if (!user) {
      bcrypt.hash(req.body.password, 12).then(function (hashed_password, err) {
        knex('users').insert({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: hashed_password}).then(function () {
          knex('users').where('email', req.body.email).first().then(function (newuser) {
            req.session.user = newuser;
            res.cookie('loggedIn', true);
            res.redirect('/posts');
          })
        });
      });
    } else {
      res.send('user exists!')
    }
  });
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function (req, res) {
  knex('users').where('email', req.body.email).first().then(function (user) {
    if (!user) {
      res.redirect('/signup');
    };

    bcrypt.compare(req.body.password, user.password)
      .then(function () {
        req.session.user = user;
        res.cookie('loggedIn', true);
        res.redirect('/posts');
      }, function () {
        res.redirect('back');
      });
  });
});

router.get('/logout', function (req, res) {
  req.session = null;
  res.clearCookie('loggedIn');
  res.redirect('/');
});

module.exports = router;
