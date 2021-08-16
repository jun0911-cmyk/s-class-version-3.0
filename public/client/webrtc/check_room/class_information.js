const information = document.querySelector('#class_info');
const socket = window.io();

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
            var host = result.host;
            var classroom = result.class;

            var calases = information.classList;

            information.addEventListener("click", () => {
                var push = calases.toggle('fa-info-circle');
                if(push == true) {
                    document.getElementById('dropdown').innerHTML = `
                        <i class="fas fa-cog" style="
                        font-size: 25px;
                        margin-top: 10px;
                        margin-left: 305px"></i>
                        <h2 class="title">${classroom.class_name}</h2>
                        </br>
                        <span>강의실 ID : ${roomId}</span>
                        </br></br>
                        <span>강의자 : ${host.email}</span>
                        </br></br>
                        <span>참가자 이메일 : ${user.email}</span>
                        </br></br>
                        <span style="font-size: 15px;">데이터 정보 : ${user.email} 님은 대한민국의 </br>데이터 센터에 정보가 연결되어 있습니다.</span>
                        </br>
                        <a href="#" class="emot">신고 <i class="fas fa-flag"></i></a>
                    `
                } else {
                    document.getElementById('dropdown').innerHTML = ``
                }
            });
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});