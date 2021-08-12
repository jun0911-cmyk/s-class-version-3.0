const express = require('express');
const path = require('path');
const models = require('../database_db/models');
const app = express();

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/student/check/class', express.static('../public/css'));
    app.use('/student/check/class', express.static('../public/client'));

    app.get('/student/check/class', function(req, res) {
        if(req.isAuthenticated()) {
            res.sendFile(path.join(__dirname, '..', '..', '/public/views/check_class.html'));
        } else {
            res.redirect('/');
        }
    });

    // 학생 출결목록 라우터
    app.post('/student/check/class', (req, res) => {
        if(req.isAuthenticated()) {
            models.User.findOne({
                where: {
                    email: req.user.email
                }
            }).then(function(teacherList) {
                if (teacherList.select_teacher == 'not teacher') {
                    res.json({
                        status: 'no',
                        classroom: teacherList,
                        data: req.user
                    });
                } else if (teacherList.select_teacher != 'not teacher') {
                    res.json({
                        classroom: teacherList,
                        data: req.user
                    });
                }
            })
            .catch(err => console.log(err));
        }
    });
}
