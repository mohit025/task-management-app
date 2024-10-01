
//I AM WRITTING MIDDLEWARES IN THIS FOR ADMIN AND NON ADMIN.

const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User= require('../models/user');


const isAdmin = (req, res, next) => {
    const user = req.user; 
    if (user.role !== 'admin') {
        return res.status(404).json({ message: "Access not allowed" });
    }
    next();
};

const canViewTask = (req, res, next) => {
    const user = req.user;
    const task = Task.find(task => task.id === parseInt(req.params.taskId));

    if (!task) {
        return res.status(404).json({ message: "Task not found." });
    }

    if (user.role !== 'admin' && task.createdBy !== user.id && task.assignedTo !== user.id) {
        return res.status(404).json({ message: "Access denied" });
    }

    req.task = task;
    next();
};


const assigntask = (req, res, next) => {
    const user = req.user;
    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Only admins have access"});
    }
    next();
};