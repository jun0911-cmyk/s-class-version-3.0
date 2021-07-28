export function attendanceCheck(socket, roomId, user, check_student) {
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
            Swal.fire(
                '중요사항',
                `전자출석부 실행후 아무런 메시지가 뜨지 않는다면 모든 학생이 강의실에 전부 참가한것입니다. 또한 모든 변경사항은 전자출석부에서 확인이 가능합니다.`,
                'info'
            );
            socket.emit('attendanceCheck', roomId, user);
        }
    });

    socket.on('attendanceCheck', function(roomId, user, attendanceCheck_student) {
        Swal.fire(
            '전자출석부',
            `${roomId}번 강의실에 참가하지 않은 학생이름 : ${attendanceCheck_student} 해당기록은 전자출석부로 이동됩니다.`,
            'info'
        );
    });

    socket.on('null_student', function(roomId, user) {
        Swal.fire(
            '전자출석부 오류',
            `현재 모든 세션에 참가자가 없습니다.`,
            'error'
        );
    });
}