'use strict';

const express = require('express');
const router = express.Router();

const environment = process.env.NODE_ENV;
const config = require('../knexfile.js')[environment];
const knex = require('knex')(config);

router.get('/comment/edit', function (req, res) {
  res.render('commentedit');
});

router.post('/comment', function (req, res) {
  knex('comments').insert(req.body).then(function () {
    res.redirect('back');
  });
});

router.get('/', function (req, res) {
  knex('posts').then(function (posts) {
    res.render('posts', {posts:posts});
  });
});

router.delete('/', function (req, res) {
  let postID = req.body.id
  knex('posts').where('id', postID).del().then(function () {
    res.redirect('back');
  });
});

router.get('/edit', function (req, res) {
  res.render('postedit');
});

router.put('/edit', function (req, res) {
  knex('posts').where('id', req.body.id).update({content: req.body.content, link: req.body.link}).then(function () {
    res.redirect('/posts');
  });
});

router.get('/create', function (req, res) {
  res.render('createpost');
});

router.post('/create', function (req, res) {
  let userLoggedIn = req.session.user.id;
  knex('posts').insert({content: req.body.content, link: req.body.link, user_id: userLoggedIn, img_url: req.body.img_url}).then(function () {
    res.redirect('/posts');
  });
});

router.get('/:id', function (req, res) {
  let postID = req.params.id
  knex('posts').where('id', postID).first().then(function (post) {
    knex('comments').where('post_id', postID).then(function (comments) {
      knex('users').where('id', post.user_id).first().then(function (user) {
        res.render('postpage', {post:post, comments:comments, user:user})
      });
    });
  });
});






























module.exports = router;
