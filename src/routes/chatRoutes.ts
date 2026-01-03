import { Router } from 'express';
import { getChats, createChat, sendMessage } from '../controllers/chatController';

const router = Router();

router.get('/', getChats);
router.post('/', createChat);
router.post('/:chatId/messages', sendMessage);

export default router;
