const router = require('express').Router();
const Models = require('../models');
const validator = require('validator');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  }
  res.render('signup', { messages: [] });
});

router.post('/', async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const messages = [];

  if (name === '') {
    messages.push('ユーザー名が空です');
  }
  if (email === '') {
    messages.push('メールアドレスが空です');
  }
  if (password === '') {
    messages.push('パスワードが空です');
  }

  if (messages.length > 0) {
    return res.render('signup', { messages: messages });
  }

  if (!validator.isEmail(email)) {
    messages.push('入力したEmailの形式が不正です');
    return res.render('signup', { messages: messages });
  }

  const user = await Models.User.findOne({
    where: {
      email: email,
    },
  });

  if (user) {
    messages.push('ユーザー登録に失敗しました');
    return res.render('signup', { messages: messages });
  }

  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      res.status(500);
    }

    Models.User.create({
      name: name,
      email: email,
      password: hash,
    })
      .then((user) => {
        console.log('ユーザー登録成功');
        req.session.userId = user.id;
        req.session.name = user.name;
        res.redirect('/');
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  });
});

module.exports = router;
