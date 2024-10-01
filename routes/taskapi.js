const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const jwtsec = "somesecretkey";

const authorizationMw = require('../middleware/authmidd');

const taskValidationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    dueDate: Joi.date().optional(),
    status: Joi.string().valid('To Do', 'In Progress', 'Completed'),
    assignedUser: Joi.string().required(),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Low'),
});

router.post('/tasks', authorizationMw, async (req, res) => {

    const task = new Task(req.body);
    task.assignedUser = req.user._id;
    await task.save()

    res.status(200).send(task);

})


router.get('/tasks', authorizationMw, async (req, res) => {
    const { status, priority, page = 1, limit = 5 } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    const tasks = await Task.find(filters).skip((page - 1) * limit).limit(limit);
    res.status(200).send(tasks);
});

router.patch('/tasks/:id', async (req, res) => {


    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { title: req.body.title, description: req.body.description }, { new: true });

        if (!task) {
            return res.status(400).send('task has been not found');
        }
        res.send(task);
    }
    catch (e) {
        res.status(400).send('some error in server');
    }
});

router.delete('/tasks/:id', async (req,res)=>{

    try{
        const task=await Task.findByIdAndDelete(req.params.id);

        if(!task)
            return res.status(404).send('task is not found by this ID')

        res.send('task is been deleted');
    }
    catch(e){
    res.status(400).send('some error in server');
    }
})


