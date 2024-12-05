const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return req.status(500).json({
                error: err
            });
        }
        else {
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                password: hash,
                phone: req.body.phone,
                email: req.body.email,
                userType: req.body.userType
            })
            console.log(user);
            user.save()
                .then(result => {
                    res.status(200).json({
                        new_user: result
                    })
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        }
    })


});
router.post('/login', (req, res, next) => {
    User.find({ username: req.body.username }).exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    msg: "user not exist"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (!result) {
                    return res.status(401).json({
                        msg: "password not matched"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        username: user[0].username,
                        userType: user[0].userType,
                        phone: user[0].phone,
                        email: user[0].email
                    },
                        'this is dummy text', {
                        expiresIn: "24h"
                    }
                    ); res.status(200).json({
                        username: user[0].username,
                        userType: user[0].userType,
                        phone: user[0].phone,
                        email: user[0].email,
                        token: token


                    })
                }
            });
        }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})





module.exports = router; 