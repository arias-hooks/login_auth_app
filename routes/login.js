const router = require('express').Router();
const Models = require("../models");
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  }
  res.render('login');
});

router.post('/', (req, res, next) => {
  Models.User.findOne(
    {
      where: {
        email: req.body.email
      }
    })
    .then((user) => {
      if (!user) {
        res.redirect('/login');
      } else {
        const plain = req.body.password;
        const hash = user.password;
        bcrypt.compare(plain, hash, (error, isEqual) => {
          if (isEqual) {
            console.log('ログイン成功');
            req.session.userId = user.id;
            req.session.name = user.name;
            res.redirect('/');
          } else {
            res.redirect('/login');
          }
        });
      }
    });
});

module.exports = router;
