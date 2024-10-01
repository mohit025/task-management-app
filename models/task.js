const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required:true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default:'To Do'
    },
    dueDate: {
        type: Date
    },
   
    assignedUser: {
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default:'Low'
    }
},{
    timestamps:true
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
