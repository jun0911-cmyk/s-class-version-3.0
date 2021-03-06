import { invite_code } from "../invite/invite_code.js";
import { inviteStatus } from "../invite/invite_status.js";

const room_socket = window.io();

$(function() {
    $.ajax({
        url: '/student/class',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var data = result.data;
            var classroom = result.classroom;
            var status = result.status;
            var classList = [];

            room_socket.emit('addclassroom', classroom, data);

            room_socket.on('addclassroom', function(classroomList) {
                for (var i = 0; i < classroomList.length; i++) {
                    classList.push(classroomList[i]);
                }
            });

            document.getElementById('invite').addEventListener('click', startInvite);

            function startInvite() {
                invite_code(room_socket, data);
            }

            Vue.component('account-component', {
                template: `
                    <div class="dropdown">
                        <a href="javascript:void(0)" class="singup">
                            <i class="fas fa-user-circle" style="font-size: 27px; margin-top: 10px; margin-left: 10px;"></i>
                        </a>
                        <div class="dropdown-content">
                            <a href="/student/check/class">수강 이력</a>
                            <a href="#">내 정보</a>
                            <a href="#">정보 변경</a>
                            <a href="/user/logout">로그아웃<i class="fas fa-sign-out-alt"></i></a>
                        </div>
                    </div>
                `
            });

            Vue.component('bell-component', {
                template: `
                    <i class="fas fa-bell" style="font-size: 27px; margin-left: 30px;"></i>
                `
            });

            Vue.component('main-component', {
                template: `
                    <h1>${data.email} 님의 온라인 강의실</h1>
                `
            });

            Vue.component('sub-component', {
                template: `
                <h3>현재 온라인 강의 목록</h3>
                `
            });

            new Vue({
                el: '#main_content'
            });

            new Vue({
                el: '#sub_content'
            });

            new Vue({
                el: '#account'
            });

            new Vue({
                el: '#col',
                data() {
                    return {
                        classroom_data: []
                    }
                },
                created() {
                    if (status == 'no') {
                        Swal.fire(
                            '강의실 없음',
                            '현재 등록되신 강의실이 없으십니다. 강사코드로 강사를 추가해보세요. (이 메시지는 경고메시지가 아닙니다.)',
                            'error'
                        )
                    } else {
                        this.classroom_data = classList
                    }
                }
            });

            $(document).on("click", "#room_btn", function() {
                var checkBtn = $(this);
                var tr = checkBtn.parent().parent();
                var td = tr.children();
                var room_name = td.eq(0).text(); 
                for(var i = 0; i < classList.length; i++) {
                    if (classList[i].class_name == room_name) {
                        Swal.fire({
                            title: `${classList[i].class_name}에 접속하시겠습니까?`,
                            text: "접속하시려면 접속하기를 눌러주세요.",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: '접속하기',
                            cancelButtonText: '취소'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                for (var j = 0; j < classList.length; j++) {
                                    if (classList[j].class_name == room_name) {
                                        location.href = `/class/check/room/${classList[j].class_id}`;
                                    }
                                }
                            }
                        });
                    }
                }
            });
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});