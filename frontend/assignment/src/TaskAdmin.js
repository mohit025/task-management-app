import React, { useState, useEffect } from 'react'
import axios from 'axios'

const TaskAdmin = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: 'To Do', // this field is by defaut as in schema of task.js (in backend models folder).
        assignedUser: '',
        priority: 'Low', // this field is by defaut as in schema of task.js (in backend models folder).
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (e) {
                console.error('Failed to fetch users:', e);
                setError('Failed to load users');
            }
        };

        fetchUsers();
    }, [token]);

    const handleChange = (e) => {
        setTask({
            ...task,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        const response = await axios.post('/tasks', task, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setTask({
            title: '',
            description: '',
            dueDate: '',
            status: 'To Do',
            assignedUser: '',
            priority: 'Low',
        });

    };



    return (
        <div>
            <h2>Assigment admin</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={task.description} onChange={handleChange} />

                </div>

                <div>
                    <label>Due Date</label>
                    <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} />
                </div>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={task.title} onChange={handleChange} required />
                </div>

                <div>
                    <label>Status</label>
                    <select name="status" value={task.status} onChange={handleChange}>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label>Priority</label>
                    <select name="priority" value={task.priority} onChange={handleChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label>Assigned User</label>
                    <select name="assignedUser" value={task.assignedUser} onChange={handleChange} required>
                        <option value="">Select a user</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.email}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">Create Task</button>
            </form>
        </div>
    );
};

export default TaskAdmin;
