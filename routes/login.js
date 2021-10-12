const router = require('express').Router();
const Models = require('../models');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  }
  res.render('login', { messages: [] });
});

router.post('/', (req, res, next) => {
  Models.User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (!user) {
      return res.render('login', { messages: ['メールアドレスまたはパスワードが間違っています'] });
    } else {
      const plain = req.body.password;
      const hash = user.password;
      bcrypt.compare(plain, hash, (error, isEqual) => {
        if (error) {
          res.status(500);
        }

        if (isEqual) {
          console.log('ログイン成功');
          req.session.userId = user.id;
          req.session.name = user.name;
          res.redirect('/');
        } else {
          return res.render('login', { messages: ['メールアドレスまたはパスワードが間違っています'] });
        }
      });
    }
  });
});

module.exports = router;
