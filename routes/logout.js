const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      res.status(500);
    }

    res.render('login', { messages: ['ログアウトしました'] });
  });
});

module.exports = router;
