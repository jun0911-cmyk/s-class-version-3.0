export function create_seat_table(roomId, user) {
    Vue.component('seat_ticket-component', {
        template: `
            <div class="seat" style="position: absolute;">
                <h3 class="seat_text">${roomId} 강의실 가상좌석표</h3>
                <button class="seat_button" id="seat_button">갱신</button>
                <div class="seat_user" id="seat_user">
                </div>
                <h5 class="seat_sub_text" id="seat_sub_text"></h5>
                <h5 class="seat_color_text">출석 : 🟢(초록색), 결석 : 🔴(빨간색)</h5>
            </div>
        `
    });

    new Vue({
        el: '#seat_ticket'
    });
}

export function toggle_seat_ticket(seat_ticket) {
    var seat_classes = seat_ticket.classList;
    var seat = seat_classes.toggle('users');
    var attendanceCheckData = JSON.parse(sessionStorage.getItem("attendanceCheckData"));

    if (seat == true) {
        if (attendanceCheckData == null) {
            Swal.fire(
                '가상좌석표 오류',
                '전자출석부를 사용하지 않은 상태로 가상좌석표를 이용할수 없습니다.',
                'error'
            );
        } else if (attendanceCheckData != null) {
            for (var j = 0; j < attendanceCheckData['attendance'].length; j++) {
                document.getElementById(attendanceCheckData['attendance'][j]).style.color = '#16c60c';
            }
    
            for (var k = 0; k < attendanceCheckData['absenteeism'].length; k++) {
                document.getElementById(attendanceCheckData['absenteeism'][k]).style.color = '#e81224';
            }
    
            $('#seat_ticket').show();
        }
    } else {
        $('#seat_ticket').hide();
    }
}