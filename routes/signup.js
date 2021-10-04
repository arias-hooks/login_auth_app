const router = require('express').Router();
const Models = require("../models");
const validator = require('validator');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  }
  res.render('signup', { errors: [] });
});

router.post('/', (req, res, next) => {
  const signup = async () => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const errors = [];

    if (name === '') {
      errors.push('ユーザー名が空です');
    }
    if (email === '') {
      errors.push('メールアドレスが空です');
    }
    if (password === '') {
      errors.push('パスワードが空です');
    }

    if (errors.length > 0) {
      return res.render('signup', { errors: errors });
    }

    if (!validator.isEmail(email)) {
      errors.push('入力したEmailの形式が不正です');
      return res.render('signup', { errors: errors });
    }


    const user = await Models.User.findOne({
      where: {
        email: email
      }
    });

    if (user) {
      errors.push('ユーザー登録に失敗しました')
      return res.render('signup', { errors: errors });
    }

    bcrypt.hash(password, 10, (error, hash) => {
      Models.User.create({
        name: name,
        email: email,
        password: hash,
      })
        .then(user => {
          console.log('ユーザー登録成功');
          req.session.userId = user.id;
          req.session.name = user.name;
          res.redirect('/');
        })
        .catch(error => {
          console.log(error);
          return null
        });
    });
  }

  signup();
});

module.exports = router;
