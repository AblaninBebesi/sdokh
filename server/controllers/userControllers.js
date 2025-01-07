const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

var verificationCodes = {};

const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password){
        res.status(400);
        throw new Error('fill all the fields');
    }

    const userExists = await User.findOne( { email });

    if (userExists) {
        res.status(400);
        throw new Error("this email has been registered before");
    }

    const user = await User.create({name, email, password})
    if (user) {
        //console.log(user);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        throw new Error ('server failure');
    }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// Настройка транспорта
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Или другой сервис
    auth: {
        user: 'ablanin.bebesi@gmail.com',
        pass: 'ifya lvuk qcii hqeo'
    }
});

// Функция отправки писем
const sendVerificationCode = (email, code) => {
    return transporter.sendMail({
        from: 'Chat App',
        to: email,
        subject: 'Chat App Verification',
        text: `Your Verification Code: ${code}`
    });
};

const sendCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Генерация 6-значного кода
  const code = crypto.randomInt(100000, 999999);

  // Сохраняем код в хранилище с привязкой к email
  verificationCodes[email] = code;

  try {
      await sendVerificationCode(email, code);
      res.json({ message: 'A verification code has been sent to your email' });
  } catch (error) {
      res.status(500).json({ message: 'Ошибка при отправке кода', error });
      console.log(error);
  }
});

const verify = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  if (verificationCodes[email] && verificationCodes[email] == parseInt(code)) {
    // Успешная проверка — удаляем код из хранилища
    delete verificationCodes[email];
    res.json({ message: 'Code accepted' });
  } else {
      res.status(400).json({ message: 'Wrong code' });
      console.log(error);
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      {name: {$regex: req.query.search, $options: "i"}},
      {email: {$regex: req.query.search, $options: "i"}},
    ]
  }: {};
  const users = await User.find(keyword)/*.find({_id: {$ne: req.user._id}})*/;
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers, sendCode, verify };