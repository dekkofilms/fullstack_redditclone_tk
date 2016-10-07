'use strict';

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../server');
const config = require('../knexfile.js')['test'];
const knex = require('knex')(config);

const bcrypt = require('bcrypt-as-promised');

describe('find initial route', function() {
  it('should go to home page', function(done) {
    request(app).get('/')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.equal(null);
        done();
      });
  });
});

describe('find signup form in auth router setup', function() {
  it('find signup form in auth router setup', function(done) {
    request(app).get('/auth/signup')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.equal(null);
        done();
      });
  });

  it('should load up a signup form', function(done) {
    request(app).get('/auth/signup')
      .expect(200)
      .end(function (err, res) {
        expect(res.text).to.include('<form method="POST" action="/auth/signup">');
        done();
      });
  });
});

describe('when a user signs up it post to DB and redirects them to users specific home page', function() {

  after(function (done) {
    knex('users').where('first_name', 'Taylor').del().then(function () {
      done();
    });
  });

  it('when a user signs up it post to DB and redirects them to users specific home page', function(done) {
    request(app).post('/auth/signup')
      .send({first_name: 'Taylor', last_name: 'King', email: 'dekko@gmail.com', password: 'password'})
      .end(function (err, res) {
        knex('users').first().then(function (data) {
          expect(data.first_name).to.equal('Taylor');
          expect(res.header['location']).to.equal('/posts');
          done();
        });
      });
  });
});

describe('when a user signs in again it redirects them back to their home page', function() {

  before(function (done) {
    bcrypt.hash('password', 12).then(function (hashed_password, err) {
      knex('users').insert({first_name: 'Taylor', last_name: 'King', email: 'dekko@gmail.com', password: hashed_password}).then(function () {
        done();
      });
    });
  });


  it('when a user signs in again it redirects them back to their home page', function(done) {
    request(app).post('/auth/login')
      .send({email: 'dekko@gmail.com', password: 'password'})
      .end(function (err, res) {
        knex('users').first().then(function (data) {
          expect(res.header['location']).to.equal('/posts');
          done();
        });
      });
  });

  after(function (done) {
    knex('users').where('first_name', 'Taylor').del().then(function () {
      done();
    });
  });
});

describe('find posts route', function() {
  it('find posts route', function(done) {
    request(app).get('/posts')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.equal(null);
        done();
      });
  });
});

describe('find create a post route', function() {
  it('find create a post route', function(done) {
    request(app).get('/posts/create')
      .expect(200)
      .end(function (err, res) {
        expect(res.text).to.include('<form method="POST" action="/posts/create">');
        done();
      });
  });
});

xdescribe('adding a post into the database', function() {

  after(function (done) {
    knex('posts').where('content', 'taylor').del().then(function () {
      done();
    });
  });

  it('should add a post into the database', function(done) {
    request(app).post('/posts/create')
      .send({content: 'taylor', link: 'google.com', img_url: 'reddit.com/img24rwffa223523', user_id: 1})
      .end(function (err, res) {
        knex('posts').where('content', 'taylor').first().then(function (post) {
          expect(post.link).to.equal('google.com');
          done();
        });
      });
  });
});

describe('users home page loads only there post', function() {

  before(function (done) {
    knex('users').insert({id: 1, first_name: 'Taylor and Ollie', last_name: 'King', email: 'dekko@gmail.com', password: 'hashed_password'}).then(function () {
      knex('posts').insert([{id: 1, content: 'sadfhawlhfe', link: 'google.com', user_id: 1}, {id: 2, content: 'sadfhawlhfe', link: 'google.com', user_id: 1}, {id: 3, content: 'sadfhawlhfe', link: 'google.com', user_id: 1}]).then(function () {
        done();
      });
    });
  });

  it('users home page loads only there post', function(done) {
    //they have 4 posts
    request(app).get('/users/1')
      .expect(200)
      .end(function (err, res) {
        knex('posts').where('user_id', 1).then(function (data) {
          expect(data.length).to.equal(3);
          done();
        })
      });
  });

  after(function (done) {
    knex('users').where('first_name', 'Taylor and Ollie').del().then(function () {
      done();
    });
  });
});

describe('find the specifc post page id route', function() {

  before(function (done) {
    knex('users').insert({id: 1, first_name: 'Taylor and Ollie', last_name: 'King', email: 'dekko@gmail.com', password: 'hashed_password'}).then(function () {
      knex('posts').insert([{id: 1, content: 'derka derka derka', link: 'google.com', user_id: 1}, {id: 2, content: 'sadfhawlhfe', link: 'google.com', user_id: 1}, {id: 3, content: 'sadfhawlhfe', link: 'google.com', user_id: 1}]).then(function () {
        done();
      });
    });
  });

  it('find the specifc post page id route', function(done) {
    request(app).get('/posts/1')
      .expect(200)
      .end(function (err, res) {
        expect(res.text).to.include('derka derka derka');
        done();
      });
  });

  after(function (done) {
    knex('users').where('first_name', 'Taylor and Ollie').del().then(function () {
      done();
    });
  });
});

describe('goes to the post id page, and loads all the proper comments', function() {

  before(function (done) {
    knex('users').insert({id: 1, first_name: 'Taylor and Ollie', last_name: 'King', email: 'dekko@gmail.com', password: 'hashed_password'}).then(function () {
      knex('posts').insert([{id: 1, content: 'derka derka derka', link: 'google.com', user_id: 1}, {id: 2, content: 'sadfhawlhfe', link: 'google.com', user_id: 1}, {id: 3, content: 'sadfhawlhfe', link: 'google.com', user_id: 1}]).then(function () {
        knex('comments').insert([{id: 1, content: 'first comment!', post_id: 1, user_id: 1}, {id: 2, content: 'second comment!', post_id: 3, user_id: 1}]).then(function () {
          done();
        });
      });
    });
  });

  it('goes to the post id page, and loads all the proper comments', function(done) {
    request(app).get('/posts/1')
      .expect(200)
      .end(function (err, res) {
        expect(res.text).to.include('first comment!');
        expect(res.text).to.not.include('second comment!');
        request(app).get('/posts/3')
          .expect(200)
          .end(function (err, res) {
            expect(res.text).to.include('second comment!');
            done();
          })
      });
  });

  after(function (done) {
    knex('users').where('first_name', 'Taylor and Ollie').del().then(function () {
      done();
    });
  });
});

describe('delete a post route working', function() {
  before(function (done) {
    knex('posts').insert({id: 1, content: 'derka derka derka', link: 'google.com'}).then(function () {
      knex('comments').insert({id: 1, content: 'first comment!', post_id: 1}).then(function () {
        done();
      });
    });
  });


  it('delete a post route working', function(done) {
    request(app).post('/posts?_method=DELETE')
      .send({id: 1})
      .end(function (err, res) {
        knex('posts').then(function (data) {
          expect(data.length).to.equal(0);
          done();
        });
      });
  });
});

describe('get the edit post route form', function() {
  it('get the edit post route form', function(done) {
    request(app).get('/posts/edit')
      .expect(200)
      .end(function (err, res) {
        expect(res.text).to.include('<form method="POST" action="/posts/edit?_method=PUT">');
        done();
      });
  });
});

describe('update a post route working', function() {
  before(function (done) {
    knex('posts').insert({id: 1, content: 'derka derka derka', link: 'google.com'}).then(function () {
      done();
    });
  });


  it('update a post route working', function(done) {
    request(app).post('/posts/edit?_method=PUT')
      .send({id: 1, content: 'derka derk derk', link: 'google.com'})
      .end(function (err, res) {
        knex('posts').where('id', 1).first().then(function (data) {
          expect(data.content).to.equal('derka derk derk');
          done();
        });
      });
  });

  after(function (done) {
    knex('posts').where('id', 1).del().then(function () {
      done();
    });
  });
});

describe('adding a comment to a specific post in the database', function() {
  before(function (done) {
    knex('posts').insert({id: 1, content: 'derka derka derka', link: 'google.com'}).then(function () {
      done();
    });
  });

  it('adding a comment to a specific post in the database', function(done) {
    request(app).post('/posts/comment')
      .send({post_id: 1, content: 'this is the first comment to post 1'})
      .end(function (err, res) {
        knex('comments').first().then(function (comment) {
          expect(comment.content).to.equal('this is the first comment to post 1');
          expect(comment.post_id).to.equal(1);
          done();
        });
      });
  });

  after(function (done) {
    knex('posts').where('id', 1).del().then(function () {
      done();
    });
  });
});

describe('get the edit comment route form', function() {
  it('get the edit comment route form', function(done) {
    request(app).get('/posts/comment/edit')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.equal(null);
        done();
      });
  });
});
