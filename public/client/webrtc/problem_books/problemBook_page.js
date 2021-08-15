$(function() {
    $.ajax({
        type: 'POST',
        url: '/problem',
        data: {
        },   
        datatype: 'json',
        success: function(result) {
            const problem = result.problem
            const user = result.user;
            const problem_count = result.rows_number

            Vue.component('account-component', {
                template: `
                    <div class="dropdown">
                        <a href="javascript:void(0)" class="singup">
                            <i class="fas fa-user-circle" style="font-size: 27px; margin-top: 10px"></i>
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

            new Vue({
                el: '#col',
                data() {
                    return {
                        problem_data: []
                    }
                },
                created() {
                    for(var i = 0; i < problem.length; i++) {
                        if (problem_count.rows[i].commentary == 0) {
                            problem_count.rows[i].commentary = '🔴 (등록안됨)'
                        } else {
                            problem_count.rows[i].commentary = '🟢 (등록됨)'
                        }
                    }
                    this.problem_data = problem_count.rows
                }
            });

            new Vue({
                el: '#account'
            });
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});