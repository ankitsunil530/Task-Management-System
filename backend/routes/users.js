import express from 'express';

import { deleteUser, editUser, getData,getIduser } from '../controllers/users.js';
const router = express.Router();

router.get('/userdata', getData)
router.delete('/delete/:id', deleteUser);
router.put('/edit/:id', editUser);
router.get('/:user_id',getIduser);
export default router;