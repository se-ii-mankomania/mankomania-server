const { validationResult } = require("express-validator");
const envVariables = require('../utils/decrypt.js');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
      const response = {
        message: 'Something went wrong.',
      };
      res.status(400).json(response);
      return;
      }
  
    const email = req.body.email;
    const password = req.body.password;
  
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
    
        const userDetails = {
          email: email,
          password: hashedPassword,
        };
    
        const result = await User.register(userDetails);
    
        res.status(201).json({ message: 'User registered!' });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    };



exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.getByEmail(email);
    
        if (user.length == 0) {
        const error = new Error('A user with this email could not be found.');
        const response = {
          message: 'credentials invalid',
        };
        res.status(400).json(response);
        return;
        }
    
        const storedUser = user[0];
    
        const isEqual = await bcrypt.compare(password, storedUser.password);
    
        if (!isEqual) {
        const error = new Error('Wrong password!');
        const response = {
          message: 'credentials invalid',
        };
        res.status(400).json(response);
        return;
        }
    
        const token = jwt.sign(
        {
          userId: storedUser.userid,
          email: storedUser.email,
            
        },
        envVariables.JWT,
        { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, userId: storedUser.usrid });
    } catch (err) {
        if (!err.statusCode) {
        err.statusCode = 500;
        }
        next(err);
    }
    };
