const EventEmitter = require('events');
const models = require('../../database_db/models');

var event = new EventEmitter();

event.on('check_array', function(array, target_array, push_array) {
    var result_array = array.filter(x => target_array.includes(x));
    return push_array.push(result_array);
});