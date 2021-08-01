export function toggle_seat_ticket(socket, roomId, user, seat_ticket) {
    var seat_classes = seat_ticket.classList;
    var seat = seat_classes.toggle('users');
    if (seat == true) {
        $('#seat_ticket').show();
        Vue.component('seat_ticket-component', {
            template: `
                <div class="seat" style="position: absolute;">
                    <h3 class="seat_text">${roomId} 강의실 가상좌석표</h3>
                    <div class="seat_user" id="seat_user">
                        <i class="fas fa-user-alt" id="create_user" style="
                            position: absolute;
                            color: #16c60c;
                            font-size: 70px;
                            margin-top: 20px;
                            margin-left: 60px;
                        "></i>
                        <i class="fas fa-user-alt" id="create_user" style="
                            position: absolute;
                            color: #16c60c;
                            font-size: 70px;
                            margin-top: 20px;
                            margin-left: 140px;
                        "></i>
                        <i class="fas fa-user-alt" id="create_user" style="
                            position: absolute;
                            color: #16c60c;
                            font-size: 70px;
                            margin-top: 20px;
                            margin-left: 220px;
                        "></i>
                        <i class="fas fa-user-alt" id="create_user" style="
                            position: absolute;
                            color: #16c60c;
                            font-size: 70px;
                            margin-top: 20px;
                            margin-left: 300px;
                        "></i>
                        <i class="fas fa-user-alt" id="create_user" style="
                            position: absolute;
                            color: #16c60c;
                            font-size: 70px;
                            margin-top: 20px;
                            margin-left: 380px;
                        "></i>
                        <i class="fas fa-user-alt" id="create_user" style="
                            position: absolute;
                            color: #16c60c;
                            font-size: 70px;
                            margin-top: 20px;
                            margin-left: 460px;
                        "></i>
                        <i class="fas fa-user-alt" id="create_user" style="
                            position: absolute;
                            color: #16c60c;
                            font-size: 70px;
                            margin-top: 20px;
                            margin-left: 540px;
                        "></i>
                    </div>
                    <h5 class="seat_sub_text">현재 출석 : 명, 미인정 결석 : 명</h5>
                    <h5 class="seat_color_text">출석 : 🟢(초록색), 미인정 결석 : 🔴(빨간색)</h5>
                </div>
            `
        });

        new Vue({
            el: '#seat_ticket'
        });
    } else {
        $('#seat_ticket').hide();
    }
}