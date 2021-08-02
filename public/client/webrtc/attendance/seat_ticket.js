export function toggle_seat_ticket(socket, roomId, user, seat_ticket) {
    var attendanceCheckData = JSON.parse(sessionStorage.getItem("attendanceCheckData"));
    var seat_classes = seat_ticket.classList;
    var seat = seat_classes.toggle('users');
    var pxData = -20;

    if (seat == true) {
        $('#seat_ticket').show();

        Vue.component('seat_ticket-component', {
            template: `
                <div class="seat" style="position: absolute;">
                    <h3 class="seat_text">${roomId} 강의실 가상좌석표</h3>
                    <div class="seat_user" id="seat_user">
                    </div>
                    <h5 class="seat_sub_text">현재 출석 : ${attendanceCheckData['attendance'].length}명, 결석 : ${attendanceCheckData['absenteeism'].length}명</h5>
                    <h5 class="seat_color_text">출석 : 🟢(초록색), 결석 : 🔴(빨간색)</h5>
                </div>
            `
        });

        new Vue({
            el: '#seat_ticket'
        });

        $(function() {
            for (var i = 0; i < attendanceCheckData['all_student'].length; i++) {
                pxData = pxData + 80;
                $('#seat_user').append(`
                    <i class="fas fa-user-alt" id="${attendanceCheckData['all_student'][i]}" style="
                        position: absolute;
                        color: gray;
                        font-size: 70px;
                        margin-top: 20px;
                        margin-left: ${pxData}px;
                    "></i>
                `);
            }

            for (var j = 0; j < attendanceCheckData['attendance'].length; j++) {
                document.getElementById(attendanceCheckData['attendance'][j]).style.color = '#16c60c';
            }

            for (var k = 0; k < attendanceCheckData['absenteeism'].length; k++) {
                document.getElementById(attendanceCheckData['absenteeism'][k]).style.color = '#e81224';
            }
        });
    } else {
        $('#seat_ticket').hide();
    }
}