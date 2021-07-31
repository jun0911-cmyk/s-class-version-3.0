export async function problem_search(user, roomId) {
    const { value: problem_cate } = await Swal.fire({
        title: `문제 카테고리를 입력해주세요.`,
        input: 'text',
        inputLabel: '입력 예시 ex): 과목명, 문제카테고리 = 수학, 근해공식 (특수문자 구분 필수)',
        icon: 'info'
    });

    if (problem_cate) {
        var problem_cate_spilt = problem_cate.split(", ");
        if (problem_cate_spilt.length == 0 || problem_cate_spilt.length == 1) {
            Swal.fire(
                '카테고리 검색 오류',
                '카테고리에 맞는 문제를 검색하지 못하였습니다. 과목명, 문제카테고리의 형식으로 검색하였는지 확인해주세요.',
                'error'
            );
        } else {
            Swal.fire({
                icon: 'info',
                title: `카테고리 검색결과`,
                text: `설정 과목 : ${problem_cate_spilt[0]}, 카테고리 : ${problem_cate_spilt[1]}, 카테고리 검색 결과를 확인해주세요. 선택하신 정보로 문제를 보내시겠습니까?`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `문제 보내기`,
                cancelButtonText: '취소'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        `테스트`,
                        '이 기능은 곧 추가 됩니다.',
                        'success'
                    );
                }
            });
        }
    }
}