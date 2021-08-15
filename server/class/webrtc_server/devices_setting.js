const express = require('express');
const path = require('path');
const models = require('../../database_db/models');
const app = express();
const io = require('socket.io');

var roomId;

module.exports = function(app, io, server) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/class/live/room/classroom/setting/:roomid&:pwd', express.static('../public/css'));
    app.use('/class/live/room/classroom/setting/:roomid&:pwd', express.static('../public/client/webrtc'));

    app.get('/class/live/room/classroom/setting/:roomid&:tocken&:pwd', function(req, res) {
        if(req.isAuthenticated()) {
            if (req.user.user_id == req.params.roomid && req.user.user_group == 'teacher') {
                res.sendFile(path.join(__dirname, '..', '..', '..', '/public/views/devices_setting.html'));
                roomId = req.params.roomid;
                return;
            }
            if (req.user.user_id !== req.params.roomid || req.user.user_group !== 'teacher') {
                res.sendFile(path.join(__dirname, '..', '..', '..', '/public/views/client_devices_setting.html'));
                roomId = req.params.roomid;
            }
        } else {
            res.redirect('/');
        }
    });

    // 디바이스 장치 선택 페이지 라우터
    app.post('/class/live/room/classroom/setting/:roomid&:pwd', (req, res) => {
        if(req.isAuthenticated()) {
            res.json({ user: req.user, roomid: roomId });
        }
    });
}