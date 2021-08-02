export function attendanceCheck(socket, roomId, user, check_student) {
    var client_array = [];

    Swal.fire({
        icon: 'info',
        title: `전자출석부`,
        text: `${roomId}번 강의실에 대한 전자출석부를 사용하시려면 승인버튼을 눌러주세요. 확인할 총 인원 : ${check_student}명`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `승인`,
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            socket.emit('attendanceCheck', roomId, user);
        }
    });

    socket.on('attendanceCheck', function(roomId, user, student_array, client) {
        for (var i = 0; i < client.length; i++) {
            if (client[i].connect_room == roomId) {
                client_array.push(client[i].client_name); 
            }  
        }
        var attendanceCheck_array = student_array.filter(x => !client_array.includes(x));
        var attendanceCheckData = {
            "absenteeism": attendanceCheck_array,
            "attendance": client_array,
            "all_student": student_array 
        };
        if (attendanceCheck_array.length == 0) {
            Swal.fire(
                '전자출석부 조회결과',
                `수업 미출석 : 0명, 수업 출석 : ${client_array.length}명 모든 학생이 출석하였습니다`,
                'success'
            );
            sessionStorage.setItem("attendanceCheckData", JSON.stringify(attendanceCheckData));
        } else if (attendanceCheck_array.length != 0) {
            Swal.fire(
                '전자출석부 조회결과',
                `수업 미출석 : ${attendanceCheck_array.length}명, 수업 출석 : ${client_array.length}명, 현재 출석하지 않은 학생이름 : ${attendanceCheck_array}`,
                'info'
            );
            sessionStorage.setItem("attendanceCheckData", JSON.stringify(attendanceCheckData));
        }
    });
}