class Queue {
    constructor() {
        this.question_array = [];
    }
    pushQueue(question) {
        this.question_array.push(question);
    }
    delQueue() {
        return this.question_array.shift();
    }
}

const queue = new Queue();

export function questionQueue(socket, roomId, user, question) {
    queue.pushQueue(question);
    for (var i = 0; i < queue.question_array.length; i++) {
        
    }
}