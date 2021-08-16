'use strict';

import {sendMessage, onMessage, ScreenSendMessage, ScreenOnMessage} from "../webrtc_protocol/signaling_client.js";
import {host_leave_class} from "../leave_class/exit_class.js";
import {delete_call, host_delete_class} from "../leave_class/delete_class.js";
import {mute_audio, enabled_video} from "../device_setting/devices_mute.js";
import {displayMedia, displayConnectProtocol} from "../webrtc_protocol/display_media.js";
import {WaitingRoom} from "../wait_room/host_waiting_room.js";
//import {select_devicesList} from "../device_setting/select_devices.js";
//import {audio_devices_setting} from "../device_setting/select_devices_setting.js";
import {attendanceCheck} from "../attendance/attendance_check.js";
import {problem_search} from "../problem_books/select_problem.js";
import {create_seat_table, seat_recreate, toggle_seat_ticket} from "../attendance/seat_ticket.js";
import {question_send} from "../questionQueue/question.js";
//import {SDPOfferProtoCol, SDPStatusProtoCol} from "../webrtc_protocol/p2p_protocol.js";

const socket = window.io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const muteAudio = document.getElementById('audios');
const muteVideo = document.getElementById('videos');
const screen = document.getElementById('screens');
const videoSelect = document.getElementById('VideoSelect');
const problem_book = document.getElementById('levels');
const chatting = document.getElementById('chatting');
const audioOutputSelect = document.getElementById('AudioOutputSelect');
const audioInputSelect = document.getElementById('AudioInputSelect');
const selectors = [videoSelect, audioInputSelect, audioOutputSelect];
const rtcPeerConnection = new RTCPeerConnection({
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
});

const DevicesRtcPeerConnection = new RTCPeerConnection({
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
            // 로그인 유저 정보와 연결된 강의실 id response
            var user = result.user;
            var roomId = result.roomid;
            var localStream;
            // 선택한 비디오 소스와 오디오 소스, 스피커 싱크 소스를 변수에 저장
            var videoSource = localStorage.getItem('videoSource');
            var audioSource = localStorage.getItem('audioSource');
            var audioOutPutSinkid = localStorage.getItem('audioOutPutSinkid');
            // 전자출석부 배열
            var attendanceCheck_array = [];

            // 학생 대기실 승인 여부 확인 함수
            WaitingRoom(socket, roomId);
            // 가상좌석표 생성 함수
            create_seat_table(roomId, user);

            $('#seat_ticket').hide();

            // 오디오 뮤트 함수
            muteAudio.addEventListener('click', audios);
            // 비디오 끄기 함수
            muteVideo.addEventListener('click', videos);
            // 문제선택 페이지 함수
            problem_book.addEventListener('click', problem_page);
            // 질문큐 함수
            chatting.addEventListener('click', function(e) {
                window.open("/class/live/room/classroom/10321100&testing&testing/#noscroll","팝업 테스트","width=450, height=800, top=10, left=10");
            });

            // 가장좌석표 재갱신 버튼
            document.getElementById('seat_button').addEventListener('click', seat_recreate);

            // 전자출석부 확인 함수
            function start_attendanceCheck() {
                // 전자출석부 이용 권한 확인 이벤트
                socket.emit('check_attendanceCheck', roomId, user);
                // 모든 세션에 참가자가 없을때
                socket.on('null_student', function() {
                    Swal.fire(
                        '전자출석부 오류',
                        '현재 모든 강의실에 학생들이 없습니다.',
                        'error'
                    );
                });
                // 전자출서부가 준비되었을때 이벤트
                socket.on('ready_attendanceCheck', function(roomId, user, client, student) {
                    // 해당 강의실에 참가자 확인
                    for (var i = 0; i < client.length; i++) {
                        if (client[i].connect_room == roomId) {
                            attendanceCheck_array.push(client[i].client_name);
                        }
                    }
                    // 강의실에 참가자가 0명 일떄
                    if (attendanceCheck_array.length == 0) {
                        Swal.fire(
                            '전자출석부 오류',
                            `현재 ${roomId}번 강의실에 참가한 학생들이 없습니다.`,
                            'error'
                        );
                    } else if (attendanceCheck_array.length != 0) {
                        // 전자출석부 실행 함수
                        attendanceCheck(socket, roomId, user, student, seat_recreate);
                    }
                });
            }

            function set_seat_ticket() {
                // 가상 좌석표 toggle 버튼
                toggle_seat_ticket(seat_ticket);
            }
        
            function audios() {
                // 뮤트 오디오
                mute_audio(localVideo, localStream);
            }
        
            function videos() {
                // 비디오 켜기/끄기
                enabled_video(localVideo, localStream);
            }

            function problem_page() {
                // 문제풀이 알고리즘 검색 페이지
                problem_search(user, roomId);
            }

            // 입력받은 출력 싱크 소스가 있을경우
            if (audioOutPutSinkid != undefined) {
                // 출력장치 싱크 아이디를 설정
                localVideo.setSinkId(audioOutPutSinkid);
            }

            // 사용자 강의실 오디오 비디오 연결
            navigator.mediaDevices.getUserMedia({
                // 오디오 소스 설정
                audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
                // 비디오 소스 설정
                video: {deviceId: videoSource ? {exact: videoSource} : undefined}
            }).then(stream => {
                // 처음 연결되었을때 트랙 모두 음소거
                stream.getVideoTracks().forEach(function(track) {
                    track.enabled = false;
                });
            
                stream.getAudioTracks().forEach(function(track) {
                    track.enabled = false;
                });

                // 강의실 오디오, 비디오 연결
                localVideo.srcObject = stream;
                // stream 변수 저장
                localStream = stream;

                // 강의실 연결되었을때 storage 값 제거
                localStorage.removeItem('videoSource');
                localStorage.removeItem('audioSource');
                localStorage.removeItem('audioOutPutSinkid');

                Swal.fire(
                    '강의실 연결성공',
                    `호스트로 강의실에 연결되었습니다. 이 메시지는 닫으셔도 됩니다.`,
                    'success'
                )
            }).catch(err => {
                Swal.fire(
                    '강의실에 연결할 수 없습니다.',
                    `내 화면을 킬 수 없습니다. 다른 장치를 선택해주세요. ${err.name}`,
                    'error'
                )
            });
            
            // 강의실 생성 완료 이벤트
            socket.emit('created_class', roomId, user);

            socket.on('created_class', function(host) {
                console.log(`성공적으로 생성되었습니다. 생성된 강의실 ID : ${host.id} 강의실 이름 : ${host.name}`);
                
                // 화면공유 시작
                screen.addEventListener('click', display);

                function display() {
                    // 화면 공유 하는 호스트 정보 전달
                    sendMessage('CONNECTION_SCREEN', host);
                    
                    // 화면 공유 함수
                    displayMedia(navigator, localScreenVideo, DevicesRtcPeerConnection, my_screen_video, sendMessage, ScreenSendMessage, DevicesRtcPeerConnection, screen);
                    
                    // 화면 공유 P2P 네트워크 연결
                    displayConnectProtocol(DevicesRtcPeerConnection, ScreenSendMessage, ScreenOnMessage);
                }
            });

            // 세션에 사용자 참가 이벤트
            socket.on('join', function(client) {
                console.log(client);
            });

            socket.on('on_Question', function(send_roomId, question, send_user) {
                question_send(roomId, send_roomId, send_user, user, question);
            });

            // 클라이언트 강의실 나가기
            host_leave_class(socket, remoteVideo);
            // 호스트 강의실 닫기 준비
            delete_call(socket, roomId);
            // 호스트 강의을 닫기
            host_delete_class(socket);
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});