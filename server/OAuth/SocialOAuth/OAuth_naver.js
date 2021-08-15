const express = require('express');
const path = require('path');
const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const models = require('../../database_db/models');
const crypto = require('crypto');
const config = require('./OAuth_config.json');
const app = express();

try {
    models.sequelize.authenticate();
    console.log('NAVER Login : Login_db Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database :', error);
}

module.exports = function(app, passport) {
    // 네이버 소셜 로그인 전용
    passport.use(new NaverStrategy({
        clientID: config.naver.clientID,
        clientSecret: config.naver.clientSecret,
        callbackURL: config.naver.callback
    }, 
    function (accessToken, refreshToken, profile, done) {
        // 이미 가입된 유저가 있는지 확인
        models.User.findOne({
            where: {
                email: profile.emails[0].value,
                platform: 'naver'
            }
        }).then(function(user) {
            var date = new Date();
            // 가입된 유저가 없으면 새로 생성
            if(!user) {
                models.User.create({
                    email: profile.emails[0].value,
                    password: accessToken,
                    user_group: 'user',
                    user_id: 'testing',
                    platform: 'naver',
                    select_teacher: 'not teacher',
                    create_account: date
                }).then(function(user) {
                    return done(null, user);
                })
                .catch(err => done(err));
            } else {
                // 이미 있으면 바로 로그인
                return done(null, user);
            }
        })
        .catch(err => done(err));
    }));

    // 네이버에 있는 프로필 scope를 받아옴
    app.get('/auth/naver', passport.authenticate('naver', { scope: ['profile'] }));

    app.get('/auth/naver/callback', passport.authenticate('naver', { failureRedirect: '/user/login' }),
    function(req, res) {
        res.redirect('/');
    });
}