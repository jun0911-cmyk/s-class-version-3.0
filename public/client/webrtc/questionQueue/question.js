class Queue {
    constructor() {
        this.question_arr = [];
    }
    addQueue(question) {
        this.question_arr.push(question);
    }
    delQueue() {
        this.question_arr.shift();
    }
}

const queue = new Queue();

export function question_send(roomId, send_roomId, send_user, user, question_msg) {
    console.log(question_msg);
    if (send_roomId == roomId) {
        queue.addQueue(question_msg);
        console.log(queue.question_arr);
    }
}