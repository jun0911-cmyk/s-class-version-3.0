const express = require('express');
const path = require('path');
const models = require('../database_db/models');
const app = express();

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/teacher/class', express.static('../public/css'));
    app.use('/teacher/class', express.static('../public/client'));
    app.use('/teacher/class', express.static('../public/favicon'));

    app.get('/teacher/class', function(req, res) {
        if(req.isAuthenticated()) {
            // 교사로 권한이 들어가 있으면 교사 페이지로 이동
            if (req.user.user_group == 'teacher' || req.user.user_group) {
                res.sendFile(path.join(__dirname, '..', '..', '/public/views/teacher_class.html'));
            } 
            if (req.user.user_group == 'user') {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });

    // 교사 강의실 라우터
    app.post('/teacher/class', (req, res) => {
        if(req.isAuthenticated()) {
            // 강의실 DB중 class_id row중 user_id와 일치한 강의실 리스트를 불러옴
            models.class.findAll({
                where: {
                    class_id: req.user.user_id
                }
            }).then(function(classroom_data) {
                // 쿼리문에서 count 메서드
                models.class.findAndCountAll({
                    where: {
                        class_id: req.user.user_id
                    }
                })
                .then(function(count_data) {
                    res.json({ 
                        classroom: classroom_data, 
                        user: req.user,
                        rows_number: count_data 
                    });
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
    });
}