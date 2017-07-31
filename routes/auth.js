var express = require('express');
var router = express.Router();

var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy
var JirenguStrategy = require('passport-jirengu').Strategy

passport.serializeUser(function(user,done) {
    done(null, user)
})

passport.deserializeUser(function(obj, done){
  done(null, obj)
})

/* 饥人谷登录 */
passport.use(new JirenguStrategy({
  clientID: '447ee0531b6ecaf856c7e3ee5720b149b89d9e4c8a00fae5a841a9b0064410681',
  tokenURL: 'http://user.jirengu.com/oauth/token',
  clientSecret: '512cb20230f09ac1e741a9fde04dfee6b190f248fd8e9563333b560be163e30f',
  callbackURL: "http://47.91.156.35:3737/auth/jirengu/callback"},
  function(accessToken, refreshToken, profile, done){
    done(null, profile)
  }))

router.get('/jirengu', 
  passport.authenticate('jirengu'));

router.get('/jirengu/callback', 
  passport.authenticate('jirengu', {failureRedirect: '/'}),
  function(req, res){
    req.session.user = {
      id: req.user._json.id,
      username: req.user_json.name,
      avator: req.user._json.avatar,
      provider: req.user.provider
    }
    res.redirect('/')
  });


/* github 登录 */
passport.use(new GitHubStrategy({
    clientID: '0b86eb9169d120bd5331',
    clientSecret: 'b65883c3635ff9d5a4dd40455374141576d25cd6',
    callbackURL: "http://localhost:3737/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile)
  }
));

router.get('/github',
  passport.authenticate('github'));
 
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('github success.....')
    console.log(req.session.user)
    req.session.user = {
      id: req.user.id,
      username: req.user.displayName || req.user.username,
      avatar: req.user._json.avatar_url,
      provider: req.user.provider
    }
    res.redirect('/');
  });

/* 注销 */
router.get('/logout', function(req, res){
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
