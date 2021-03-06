'use strict';

import {sendMessage, onMessage} from "../webrtc_protocol/signaling_client.js";
import {leave_call, client_leave_class} from "../leave_class/exit_class.js";
import {mute_audio, enabled_video} from "../device_setting/devices_mute.js";
import {client_close_class} from "../leave_class/delete_class.js";
import {question_send} from "../questionQueue/question.js";
// import {SDPAnswerProtoCol} from "../webrtc_protocol/p2p_protocol.js";

const socket = window.io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const muteAudio = document.getElementById('audios');
const muteVideo = document.getElementById('videos');
const my_localvideo = document.getElementById('my_localvideo');
const rtcPeerConnection = new RTCPeerConnection({
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
});

$(function() {
    $.ajax({
        url: '/class/live/room/classroom/:id&:pwd',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var user = result.user;
            var roomId = result.roomid;
            var localStream;
            var videoSource = localStorage.getItem('videoSource');
            var audioSource = localStorage.getItem('audioSource');
            var audioOutPutSinkid = localStorage.getItem('audioOutPutSinkid');

            muteAudio.addEventListener('click', audios);
            muteVideo.addEventListener('click', videos);
            my_localvideo.addEventListener('click', toggle_video);

            function toggle_video() {
                var localVideoClasses = localVideo.classList;
                var localVideoToggle = localVideoClasses.toggle('fa-tablet');
                if (localVideoToggle == true) {
                    my_localvideo.style.backgroundColor = 'white';
                    my_localvideo.style.color = '#525252';
                    localVideo.style.zIndex = '20';
                } else {
                    my_localvideo.style.backgroundColor = '#525252';
                    my_localvideo.style.color = 'white';
                    localVideo.style.zIndex = '0';
                }
            }
        
            function audios() {
                mute_audio(localVideo, localStream);
            }
        
            function videos() {
                enabled_video(localVideo, localStream);
            }

            if (audioOutPutSinkid != undefined) {
                localVideo.setSinkId(audioOutPutSinkid);
            }

            navigator.mediaDevices.getUserMedia({
                audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
                video: {deviceId: videoSource ? {exact: videoSource} : undefined}
            }).then(stream => {
                stream.getVideoTracks().forEach(function(track) {
                    track.enabled = false;
                });
            
                stream.getAudioTracks().forEach(function(track) {
                    track.enabled = false;
                });
            
                localVideo.srcObject = stream;
                localStream = stream;

                var track = stream.getVideoTracks()[0];
                rtcPeerConnection.addTrack(track, stream);

                localStorage.removeItem('videoSource');
                localStorage.removeItem('audioSource');
                localStorage.removeItem('audioOutPutSinkid');

                Swal.fire(
                    '????????? ????????????',
                    `???????????? ???????????? ?????????????????????. ??? ???????????? ???????????? ?????????.`,
                    'success'
                )
            });
            
            socket.emit('joined_class', roomId, user);

            socket.on('joined_class', function(client) {
                console.log(`${client.connect_room}??? ???????????? ??????????????? ?????????????????????.`);

                onMessage('CONNECTION_SCREEN', function(data) {
                    if (data.id == roomId) {
                        window.open(`/class/live/room/classroom/screen/10329912&testing&testing`);
                    }
                });
            });

            socket.on('on_Question', function(send_roomId, question, send_user) {
                console.log(question);
                question_send(roomId, send_roomId, send_user, user, question);
            });

            leave_call(socket, roomId, user);
            client_leave_class(socket, user);
            client_close_class(socket);
        },
        error: function(request,status,error) { 
            console.log('?????? ????????? ????????? ?????????????????????.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}); 
