const router = require('express').Router();
const Models = require('../models');
const nodemailer = require('nodemailer');
const moment = require('moment');
const bcrypt = require('bcrypt');
const UUIDHelper = require('../helper/uuidHelper.js');

router.get('/resetPassword', (req, res, next) => {
  res.render('users/resetPassword');
});

router.post('/resetPassword', async (req, res, next) => {
  const email = req.body.email;
  const user = await Models.User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.render('login', { messages: [] });
  }

  user.verificationToken = UUIDHelper.generateUUID();
  user.verificationTokenExpiredAt = moment().add(30, 'minutes').toDate();

  await user.save();

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const rootUrl = 'http://localhost:3000';
  const resetPasswordURL = `${rootUrl}/users/verification?token=${user.verificationToken}`;

  transporter
    .sendMail({
      from: 'from@example.com',
      to: email,
      subject: 'パスワード再発行メール',
      text: '以下のURLをクリックしてパスワードを再発行してください。\n\n' + resetPasswordURL,
    })
    .then((info) => {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.send('パスワードリセットメールを送信しました。');
    })
    .catch((error) => {
      console.log(error);
      return res.render('login', { messages: ['エラーが発生しました'] });
    });
});

router.get('/verification', (req, res, next) => {
  const token = req.query.token;

  Models.User.findOne({
    where: {
      verificationToken: token,
    },
  })
    .then((user) => {
      if (!user) {
        return res.render('login', { messages: ['エラーが発生しました'] });
      }
      if (moment().isAfter(moment(user.verificationTokenExpiredAt), 'second')) {
        return res.render('verificationExpired');
      }

      return res.render('users/verification', {
        verificationToken: token,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.render('login', { messages: ['エラーが発生しました'] });
    });
});

router.post('/verify', async (req, res, next) => {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const token = req.body.verificationToken;

  const user = await Models.User.findOne({
    where: {
      verificationToken: token,
    },
  });

  if (!user) {
    return res.render('login', { messages: ['エラーが発生しました'] });
  }

  if (moment().isAfter(moment(user.verificationTokenExpiredAt), 'second')) {
    return res.render('verificationExpired');
  }

  if (password !== passwordConfirm) {
    return res.render('users/verification', { verificationToken: token });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  user.password = hashedPassword;
  user.verificationToken = null;
  user.verificationTokenExpiredAt = null;
  await user.save();

  console.log('パスワード更新成功');
  res.render('login', { messages: ['パスワードの更新に成功しました'] });
});

module.exports = router;
