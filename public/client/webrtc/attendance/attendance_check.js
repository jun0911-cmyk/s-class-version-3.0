export function attendanceCheck(socket, roomId, user, check_student) {
    var student_array = [];

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

    socket.on('push_attendanceCheck', function(attendanceCheck_student) {
        student_array.push(attendanceCheck_student);
    });

    socket.on('attendanceCheck', function(roomId, user) {
        Swal.fire(
            '전자출석부',
            `현재 수업에 참가하지 않은 학생 이름 : ${student_array} 해당 학생은 전자출석부로 이동됩니다.`,
            'success'
        );
    });
}