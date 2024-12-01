import express from 'express';
const router = express.Router();

import {taskData,category,addTask, getUserData, deleteTask, editTask, getPendingTasks, getCompletedTasks, getAllUserTasks} from '../controllers/task.js';

router.get('/taskData',taskData);
router.get('/categories',category);
router.post('/addTask',addTask);
router.get('/userid',getUserData);
router.delete('/delete/:id',deleteTask);
router.put('/edit/:id',editTask);
router.get('/pending',getPendingTasks);
router.get('/completed',getCompletedTasks);
router.get('/idtask',getAllUserTasks);
export default router;