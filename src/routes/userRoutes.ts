import { Router } from 'express';
import { getAllUsers, approveUser, rejectUser, updateUser } from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.put('/:id/approve', approveUser);
router.delete('/:id', rejectUser);

export default router;
