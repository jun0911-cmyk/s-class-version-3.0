const express = require('express');
const app = express();
const server = require('http').createServer(app);
const models = require('../../database_db/models');
const { QueryTypes } = require('sequelize');
const event = require('./events');
const io = require('socket.io')(server);

var clients;

var host = [];
var host_data;

var client = [];
var client_data;

module.exports = function(app, io) {
    io.on('connection', function(socket) {
        function client_object(roomId, user) {
            client_data = {
                "connect_room": roomId,
                "client_name": user.email,
                "client_id": user.user_id,
                "client_group": user.user_group,
                "connected": true,
            }
            client.push(client_data);
        }

        function host_object(roomId, room, user) {
            host_data = {
                "id": roomId,
                "name": room.class_name,
                "host_name": user.email,
                "host_group": user.user_group 
            };
            host.push(host_data);
        }

        function Network_Manager(roomId, user, room) {
            if (!room) {
                if (client.length == 0) {
                    client_object(roomId, user);
                    return;
                } 
                
                if (client.length != 0) {
                    for (var j = 0; j < client.length; j++) {
                        if (client[j].connect_room == roomId && client[j].client_name != user.email) {
                            client_object(roomId, user);
                        }
    
                        if (client[j].connect_room == roomId && client[j].client_name == user.email) {
                            client[j].connected = true;
                        }
                    }
                }
            }

            if (room) {
                if (host.length == 0) {
                    host_object(roomId, room, user);
                } 
                
                if (host.length != 0) {
                    for (var i = 0; i < host.length; i++) {
                        if (host[i].id != roomId) {
                            host_object(roomId, room, user);
                        }
                    }
                }
            }
        }

        socket.on('message', function(message) {
            socket.broadcast.emit('message', message);
        });

        socket.on('screen_message', function(message) {
            socket.broadcast.emit('screen_message', message);
        });

        // ???????????? ??????
        socket.on('checkInviteCode', function(InviteCode, user) {
            models.teacher.findOne({
                where: {
                    invite_code: InviteCode
                }
            }).then(function(result) {
                if (result == null) {
                    socket.emit('fail_code', InviteCode);
                } else {
                    const array = user.select_teacher.split(", ");
                    var check_array = [];
                    for(var i = 0; i < array.length; i++) {
                        if (array[i] == result.email) {
                            check_array.push(array[i]);
                        }
                    }
                    if (check_array.length == 0) {
                        socket.emit('success_code', InviteCode, result);
                    } else if (check_array.length != 0) {
                        socket.emit('userOverlap', result.user_id);
                    }
                }
            });
        });

        // ?????? DB??? ?????? ?????? ??????
        socket.on('AddTeacherInvite', function(classname, user) {
            models.teacher.findOne({
                where: {
                    email: classname
                }
            }).then(function(teacher) {
                if (teacher.access_student == 'not student') {
                    models.teacher.update({
                        access_student: user.email
                    }, {
                        where: {
                            email: classname
                        }
                    })
                    .catch(err => console.log(err));
                    return;
                }

                if (teacher.access_student != 'not student') {
                    models.sequelize.query(`UPDATE teacher_dbs SET access_student = CONCAT(access_student, ', ${user.email}') WHERE email = '${classname}'`, { type: QueryTypes.UPDATE })
                    .catch(err => console.log(err));
                }
            })
        });

        // ?????? DB??? ?????? ?????? ?????? ??????
        socket.on('AddInvite', function(classname, user) {
            if (user.select_teacher == 'not teacher') {
                models.User.update({
                    select_teacher: classname
                }, {
                    where: {
                        email: user.email
                    }
                }).then(function(result) {
                    socket.emit('successInvite', result);
                })
                .catch(err => console.log(err));
                return;
            } 
            
            if (user.select_teacher != 'not teacher') {
                models.sequelize.query(`UPDATE user_dbs 
                SET select_teacher = CONCAT(select_teacher, ', ${classname}') WHERE email = '${user.email}'`, { type: QueryTypes.UPDATE }).then(function(result) {
                    socket.emit('successInvite', result);
                })
                .catch(err => console.log(err));
            }
        });

        // ?????? ?????? ?????? ??????
        socket.on('inviteStatus', function(user) {
            models.User.findOne({
                where: {
                    email: user.email
                }
            }).then(function(result) {
                if (result.select_teacher == 'not teacher') {
                    socket.emit('notInvite', result);
                } else {
                    socket.emit('inviteStatus', result);
                }
            });
        });

        // ?????? ???????????? ??????
        socket.on('invite_code_check', function(user) {
            models.teacher.findOne({
                where: {
                    email: user.email
                }
            }).then(function(result) {
                socket.emit('invite_code_check', result);
            });
        });

        // ?????? ??? ?????? ?????? ??????
        socket.on('inviteList', function(invite, user) {
            const array = user.select_teacher.split(", ");
            for (j = 0; j < array.length; j++) {
                models.teacher.findAll({
                    where: {
                        email: array[j]
                    }
                }).then(function(inviteList) {
                    socket.emit('inviteList', inviteList);
                });
            }
        });


        // ?????? ?????? ??????
        socket.on('delect_teacher', function(delectUser, user) {
            const array = user.select_teacher.split(", ");
            if (array.length == 1) {
                models.User.update({
                    select_teacher: 'not teacher'
                }, {
                    where: {
                        email: user.email
                    }
                }).then(function(delectsuccess) {
                    socket.emit('delect_teacher', delectsuccess);
                });
            } else if (array.length != 1) {
                for (j = 0; j < array.length; j++) {
                    console.log(array[j]);
                    if (array[j] != delectUser) {
                        models.User.update({
                            select_teacher: array[j]
                        }, {
                            where: {
                                email: user.email
                            }
                        }).then(function(delectsuccess) {
                            socket.emit('delect_teacher', delectsuccess);
                        });
                    }
                }
            }
        });

        // ????????????????????? ?????? ?????? ??????
        socket.on('delect_student', function(delectUser, user) {
            models.teacher.findOne({
                email: delectUser
            }).then(function(teacher_result) {
                const teacher_array = teacher_result.access_student.split(", ");
                if (teacher_array.length == 1) {
                    models.teacher.update({
                        access_student: 'not student'
                    }, {
                        where: {
                            email: delectUser
                        }
                    });
                } else if (teacher_array.length != 1) {
                    for (j = 0; j < teacher_array.length; j++) {
                        if (teacher_array[j] != user.email) {
                            models.teacher.update({
                                access_student: teacher_array[j]
                            }, {
                                where: {
                                    email: delectUser
                                }
                            });
                        }
                    }
                }
            });
        });

        // ????????? ?????? ?????? ??????
        socket.on('addclassroom', function(teacherList, user) {
            const array = user.select_teacher.split(", ");
            for (j = 0; j < array.length; j++) {
                models.class.findAll({
                    where: {
                        class_host: array[j],
                        class_status: '1' 
                    }
                }).then(function(classroomList) {
                    socket.emit('addclassroom', classroomList);
                });
            }
        });

        // ???????????? ?????? ?????? ??????
        socket.on('addcheckclassroom', function(teacherList, user) {
            const array = user.select_teacher.split(", ");
            for (j = 0; j < array.length; j++) {
                models.class.findAll({
                    where: {
                        class_host: array[j]
                    }
                }).then(function(classroomList) {
                    socket.emit('addcheckclassroom', classroomList);
                });
            }
        });
        
        // CREATE ROOM START ?????? ??????
        socket.on('check_create_class', function(roomId, user) {
            if (user.user_group != 'admin' || user.user_group != 'teacher') {
                socket.emit('no_permissions', roomId);
            } 

            if (user.user_group == 'admin' || user.user_group == 'teacher') {
                models.class.findOne({
                    where: {
                        class_id: roomId
                    }
                }).then(function(room) {
                    if (room == null) {
                        socket.emit('not_class', roomId);
                    }

                    if (roomId != room.class_id && user.email != room.class_host) {
                        socket.emit('not_authenticated', roomId);
                    }

                    if (roomId == room.class_id && user.email == room.class_host) {
                        socket.emit('ready_create', roomId, user);
                    }
                });
            }
        });

        // CREATE CLASS
        socket.on('create_class', function(roomId, user) { 
            models.class.findOne({
                where: {
                    class_id: roomId
                }
            }).then(function(room) {
                socket.emit('created', roomId, user.email);
            })
            .catch(err => console.log(err));
        });

        socket.on('start_class', function(roomId, user) {
            models.class.update({
                class_status: 1
            }, {
                where: {
                    class_id: roomId
                }
            });
        });

        // JOIN ROOM JOIN ?????? ??????
        socket.on('check_class', function(roomId, user) {
            models.class.findOne({
                where: {
                    class_id: roomId
                }
            }).then(function(room) {
                if (room == null) {
                    socket.emit('not_class', roomId);
                } else {
                    console.log(clients);
                    if (room.class_status == 0) {
                        socket.emit('offline_class', roomId);
                        return;
                    }

                    if (room.limit_join <= clients) {
                        socket.emit('full_class', roomId);
                        return;
                    }

                    if (host.length != 0) {
                        for (var i = 0; i < host.length; i++) {
                            if (host[i].id == roomId) {
                                socket.emit('ready_join', roomId, user);
                            }
                        }
                    }
                }
            });
        });
        
        // JOIN ROOM ???????????? ??????
        socket.on('check_class_pwd', function(roomId, password) {
            models.class.findOne({
                where: {
                    class_id: roomId
                }
            }).then(function(room) {
                if (room.class_pwd == password) {
                    socket.emit('check_success_pwd', roomId);
                } else {
                    socket.emit('check_fail_pwd', roomId);
                }
            });
        });

        // JOIN ROOM ????????? ??????
        socket.on('waiting_room', function(roomId, user) {
            io.emit('host_waiting_room', roomId, user);
        });
        
        // JOIN ROOM HOST ?????? (??????)
        socket.on('acknowledgment_class', function(roomId, user) {
            io.emit('waiting_room', roomId, user, 'success');
        });

        // JOIN ROOM HOST ?????? (?????????)
        socket.on('unlicensed_class', function(roomId, user) {
            io.emit('waiting_room', roomId, user, 'fail');
        });

        // JOIN CLASS
        socket.on('join_class', function(roomId, email, user) {
            models.teacher.findOne({
                where: {
                    user_id: roomId
                }
            }).then(function(teacher) {
                models.class.findOne({
                    where: {
                        class_id: teacher.user_id
                    }
                }).then(function(room) {
                    if (room.class_status == 1 && email == user.email) {
                        socket.emit('joined', roomId, clients);
                    }
                });
            });
        });

        socket.on('join_fail', function(roomId, email, user) {
            if (email == user.email) {
                socket.emit('joinFailed', roomId);
            }
        });

        // SUCCESS CREATED
        socket.on('created_class', function(roomId, user) {
            models.class.findOne({
                where: {
                    class_id: roomId
                }
            }).then(async function(room) {
                await Network_Manager(roomId, user, room);
                for (var i = 0; i < host.length; i++) {
                    if (host[i].id == roomId) {
                        socket.join(host[i].id);
                        socket.emit('created_class', host[i]);
                        clients = io.sockets.adapter.rooms.get(roomId).size;
                    }   
                }
            });
        });

        // SUCCESS JOINED
        socket.on('joined_class', function(roomId, user) {
            Network_Manager(roomId, user);
            for (var i = 0; i < client.length; i++) {
                if (client[i].connect_room == roomId && client[i].client_name == user.email) {
                    socket.join(client[i].connect_room);
                    socket.emit('joined_class', client[i]);
                    io.to(roomId).emit('join', client[i]);
                    io.to(roomId).emit('join_list', client[i]);
                    clients = io.sockets.adapter.rooms.get(roomId).size;
                }
            }
        });

        // ??????????????? ??????
        socket.on('check_attendanceCheck', function(roomId, user) {
            if (client.length == 0) {
                socket.emit('null_student');
                return;
            } else {
                models.class.findOne({
                    where: {
                        class_id: roomId
                    }
                }).then(function(class_data) {
                    socket.emit('ready_attendanceCheck', roomId, user, client, class_data.limit_join);
                });
            }
        });

        // ???????????????
        socket.on('attendanceCheck', function(roomId, user) {
            models.teacher.findOne({
                where: {
                    email: user.email
                }
            }).then(async function(teacher) {
                const array = teacher.access_student.split(", ");
                socket.emit('attendanceCheck', roomId, user, array, client);
            });
        });

        // ???????????????
        socket.on('attendance_seat_ticket', function(client, attendance, roomId, user) {
            if (user.user_id == roomId) {
                socket.emit('attendance_seat_ticket', attendance, client);
            }
        });

        socket.on('send_Question', function(roomId, question, user) {
            io.to(roomId).emit('on_Question', roomId, question, user);
        });

        socket.on('disconnect', function() {
        });

        // CLOSE CLASS ????????? ??????
        socket.on('close_class', function(roomId) {
            io.to(roomId).emit('close_class', roomId);

            for(var i = 0; i < host.length; i++) {
                if (host[i].id == roomId) {
                    socket.leave(host[i].id);
                    host.splice(host.indexOf(host[i]), 1);
                    models.class.update({
                        class_status: 0
                    }, {
                        where: {
                            class_id: roomId
                        }
                    });
                }
            }

            for (var j = 0; j < client.length; j++) {
                console.log(client[j]);
                if (client[j].connect_room == roomId) {
                    console.log(client[j]);
                    socket.leave(client[j].connect_room);
                    client.splice(client.indexOf(client[j]), 1);
                }
            }
        });

        // LEAVE CLASS ????????? ?????????
        socket.on('leave_class', function(roomId, user) {
            for (var i = 0; i < client.length; i++) {
                if (client[i].connect_room == roomId && client[i].client_name == user.email) {
                    socket.leave(roomId);
                    client.splice(client.indexOf(client[i]), 1);
                    clients = io.sockets.adapter.rooms.get(roomId).size;
                    io.to(roomId).emit('leave_class', roomId);
                }
            }
        });
    });
}