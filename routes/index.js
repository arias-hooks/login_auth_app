const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.userId === undefined) {
    return res.render('login', { messages: ['ログインしてください'] });
  }
  res.render('index', { message: 'ログインに成功しました！' });
});

module.exports = router;
