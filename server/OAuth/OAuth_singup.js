const express = require('express');
const path = require('path');
const crypto = require('crypto');
const models = require('../database_db/models');
const passport = require('passport');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const app = express();

try {
    models.sequelize.authenticate();
    console.log('Singup : Login_db Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = function(app, crypto) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/user/singup', express.static('../public/css'));
    app.use('/user/singup', express.static('../public/client'));

    app.get('/user/singup', (req, res) => {
        // 로그인 되어있으면 메인페이지로 리로드 안되어있으면 회원가입 페이지로 렌더링
        if(req.isAuthenticated()) {
            res.redirect('/');
        }
        else {
            res.sendFile(path.join(__dirname, '..', '..', '/public/views/singup.html'));
        }
    });
    
    app.post('/user/singup', (req, res, next) => {
        // Ajax 데이터 response
        var email = req.body.email;
        var pwd = req.body.password;
        var repwd = req.body.repassword;

        // 비밀번호 정규 표현식
        var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
        // 이메일 형식 정규 표현식
        var regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}/;

        // 페스워드 확인
        if (pwd != repwd) {
            res.json({ result:1, msg: "비밀번호와 재입력한 비밀번호가 일치하지 않습니다." });
            return;
        }

        // 비어있는 칸 확인
        if (email == '' || pwd == '' || repwd == '') {
            res.json({ result: 1, msg: "비어있는 칸이 있습니다." });
            return;
        }

        // 정규 표현식 확인 (비밀번호)
        if (regex.test(pwd) == false) {
            res.json({ result: 1, msg: "비밀번호는 특수문자, 숫자, 영문을 포함해야합니다." });
            return;
        }
    
        // 정규 표현식 확인 (이메일)
        if (exptext.test(email) == false) {
            res.json({ result: 1, msg: "이메일 형식에 맞지 않습니다." });
            return;
        }

        // User_db에 회원가입 유저 정보 등록
        else {
            var date = new Date();
            // crypto 암호와
            var hashpwd = crypto.createHash('sha512').update(pwd).digest('base64');
            models.User.findOne({
                where: {
                    email: email,
                    platform: 's-class'
                }
            }).then(function(user) {
                if(!user) {
                    models.User.create({
                        email: email,
                        password: hashpwd,
                        user_group: 'user',
                        user_id: '10321100',
                        platform: 's-class',
                        select_teacher: 'not teacher',
                        create_account: date
                    }).then(function(user) {
                        res.json({ result: 0 })
                    })
                    .catch(err => console.log(err));
                } else {
                    // 이미 해당 이메일로 가입한 사용자가 있으면 return
                    res.json({ result: 1, msg: "이미 가입하신 이메일이 있습니다. 다른 이메일로 가입하시거나 로그인해주세요." })
                }
            })
            .catch(err => console.log(err));
        }
    });
}