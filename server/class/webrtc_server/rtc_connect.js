const express = require('express');
const path = require('path');
const models = require('../../database_db/models');
const app = express();
const io = require('socket.io');

var roomId;

module.exports = function(app, io, server) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/class/live/room/classroom/:roomid&:pwd', express.static('../public/css'));
    app.use('/class/live/room/classroom/:roomid&:pwd', express.static('../public/client/webrtc'));

    app.get('/class/live/room/classroom/:roomid&:tocken&:pwd', function(req, res) {
        if(req.isAuthenticated()) {
            // 사용자 권한이 교사면 교사 강의실 로딩 학생이면 학생 강의실 로딩
            if (req.user.user_id == req.params.roomid && req.user.user_group == 'teacher') {
                res.sendFile(path.join(__dirname, '..', '..', '..', '/public/views/teacher_class_room.html'));
                roomId = req.params.roomid;
                return;
            }
            if (req.user.user_id !== req.params.roomid || req.user.user_group !== 'teacher') {
                res.sendFile(path.join(__dirname, '..', '..', '..', '/public/views/student_class_room.html'));
                roomId = req.params.roomid;
            }
        } else {
            res.redirect('/');
        }
    });

    // 강의실 라우터
    app.post('/class/live/room/classroom/:roomid&:pwd', (req, res) => {
        if(req.isAuthenticated()) {
            // json 형식으로 로그인 유저 정보와 강의실 id request
            res.json({ user: req.user, roomid: roomId });
        }
    });
}