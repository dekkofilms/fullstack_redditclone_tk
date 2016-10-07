'use strict';

const express = require('express');
const router = express.Router();

const environment = process.env.NODE_ENV;
const config = require('../knexfile.js')[environment];
const knex = require('knex')(config);

router.get('/:id', function (req, res) {
  let userLoggedIn = req.session.user.id;
  let userID = req.params.id
  knex('posts').where('user_id', userID).then(function (posts) {
    res.render('userpage', {posts:posts});
  });
});








module.exports = router;
